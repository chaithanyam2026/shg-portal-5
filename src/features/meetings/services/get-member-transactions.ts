import connectMongo from "@/lib/db/mongodb";
import { buildLoanLedger } from "@/features/loans/services/internal/loan-ledger";
import { loadRepaymentsForMembers } from "@/features/loans/services/internal/meeting-loader";
import { isRepaymentEntry } from "@/features/loans/domain";
import Loan from "@/models/Loan";
import Meeting from "@/models/Meeting";
import { Types } from "mongoose";

import type { MemberMeetingTransactions, MemberTransactionsSummary } from "../types";
import { normalizeAttendanceStatus } from "../domain/attendance-status";
import { loadFinancialYearMembers } from "./internal/load-financial-year-members";

export async function getMemberTransactions(
  meetingId: string,
): Promise<MemberTransactionsSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const members = await loadFinancialYearMembers(meeting.financialYearId.toString());
  const memberIds = members.map((member) => member._id);

  const attendanceByMemberId = new Map(
    (meeting.attendance ?? []).map((record) => [record.memberId.toString(), record]),
  );

  const paymentsByMemberId = new Map(
    (meeting.payments ?? []).map((payment) => [payment.memberId.toString(), payment]),
  );

  const loans = await Loan.find({
    financialYearId: meeting.financialYearId,
    memberId: {
      $in: memberIds.map((memberId) => new Types.ObjectId(memberId)),
    },
    status: "ACTIVE",
  }).lean();

  const loansByMemberId = new Map<string, typeof loans>();

  for (const loan of loans) {
    const memberId = loan.memberId.toString();
    const memberLoans = loansByMemberId.get(memberId) ?? [];

    memberLoans.push(loan);
    loansByMemberId.set(memberId, memberLoans);
  }

  const repaymentsByMember = await loadRepaymentsForMembers({
    memberIds: [...loansByMemberId.keys()],
  });

  const loanRepaymentByMemberId = new Map<string, number>();

  for (const [memberId, memberLoans] of loansByMemberId.entries()) {
    let loanRepayment = 0;

    for (const loan of memberLoans) {
      const passbook = await buildLoanLedger(
        {
          _id: loan._id,
          loanNumber: loan.loanNumber,
          memberId: loan.memberId,
          memberName: members.find((member) => member._id === memberId)?.name ?? "Member",
          loanType: loan.loanType,
          disbursedAmount: loan.disbursedAmount,
          interestRate: loan.interestRate,
          expectedMonthlyRepayment: loan.expectedMonthlyRepayment,
          disbursedDate: loan.disbursedDate,
          closedDate: loan.closedDate,
        },
        repaymentsByMember.get(memberId) ?? [],
      );

      for (const entry of passbook.entries) {
        if (entry.meetingId !== meetingId || !isRepaymentEntry(entry.type)) {
          continue;
        }

        loanRepayment += entry.paidPrincipal + entry.paidInterest + entry.paidLoanFine;
      }
    }

    if (loanRepayment > 0) {
      loanRepaymentByMemberId.set(memberId, loanRepayment);
    }
  }

  const records: MemberMeetingTransactions[] = members.map((member) => {
    const attendance = attendanceByMemberId.get(member._id);
    const payment = paymentsByMemberId.get(member._id);
    const contribution = payment?.contribution ?? 0;
    const absentFine = payment?.absentFine ?? 0;
    const specialLoanFine = payment?.specialLoanFine ?? 0;
    const loanRepayment = loanRepaymentByMemberId.get(member._id) ?? payment?.loanRepayment ?? 0;
    const total = contribution + loanRepayment + absentFine + specialLoanFine;

    return {
      memberId: member._id,
      memberCode: member.memberCode,
      memberName: member.name,
      attendanceStatus: attendance ? normalizeAttendanceStatus(attendance.status) : null,
      attendanceRemarks: attendance?.remarks ?? "",
      contribution,
      loanRepayment,
      absentFine,
      specialLoanFine,
      total,
    };
  });

  return {
    meetingId,
    meetingDate: meeting.meetingDate.toISOString(),
    status: meeting.status,
    records,
    totalContribution: records.reduce((sum, record) => sum + record.contribution, 0),
    totalLoanRepayment: records.reduce((sum, record) => sum + record.loanRepayment, 0),
    totalAbsentFine: records.reduce((sum, record) => sum + record.absentFine, 0),
    totalSpecialLoanFine: records.reduce((sum, record) => sum + record.specialLoanFine, 0),
    grandTotal: records.reduce((sum, record) => sum + record.total, 0),
  };
}
