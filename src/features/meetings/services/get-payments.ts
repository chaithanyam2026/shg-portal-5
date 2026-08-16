import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import type { PaymentRecord, PaymentSummary } from "../types";
import { loadFinancialYearMembers } from "./internal/load-financial-year-members";
import { loadPaymentDues } from "./internal/load-payment-dues";

function createSummary(
  meetingId: string,
  status: PaymentSummary["status"],
  records: PaymentRecord[],
  saved: boolean,
): PaymentSummary {
  const totalContribution = records.reduce((sum, record) => sum + record.contribution, 0);

  const totalLoanRepayment = records.reduce((sum, record) => sum + record.loanRepayment, 0);

  const totalAbsentFine = records.reduce((sum, record) => sum + record.absentFine, 0);

  const totalSpecialLoanFine = records.reduce((sum, record) => sum + record.specialLoanFine, 0);

  return {
    meetingId,

    status,

    records,

    totalContribution,

    totalLoanRepayment,

    totalAbsentFine,

    totalSpecialLoanFine,

    grandTotal: totalContribution + totalLoanRepayment + totalAbsentFine + totalSpecialLoanFine,

    saved,
  };
}

function emptyDues() {
  return {
    contributionDue: 0,
    absentFineDue: 0,
  };
}

export async function getPayments(meetingId: string): Promise<PaymentSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const financialYearId = meeting.financialYearId.toString();
  const payments = meeting.payments ?? [];

  const [members, dues] = await Promise.all([
    loadFinancialYearMembers(financialYearId),
    loadPaymentDues(financialYearId, meetingId, meeting.meetingDate),
  ]);

  if (payments.length === 0) {
    const records: PaymentRecord[] = members.map((member) => {
      const memberDues = dues.get(member._id.toString()) ?? emptyDues();

      return {
        memberId: member._id.toString(),

        memberCode: member.memberCode,

        memberName: member.name,

        contribution: 0,

        loanRepayment: 0,

        absentFine: 0,

        specialLoanFine: 0,

        remarks: "",

        total: 0,

        contributionDue: memberDues.contributionDue,

        absentFineDue: memberDues.absentFineDue,
      };
    });

    return createSummary(meetingId, meeting.status, records, false);
  }

  const memberMap = new Map(members.map((member) => [member._id.toString(), member]));

  const records: PaymentRecord[] = payments.map((payment) => {
    const member = memberMap.get(payment.memberId.toString());
    const memberDues = dues.get(payment.memberId.toString()) ?? emptyDues();

    const total =
      payment.contribution + payment.loanRepayment + payment.absentFine + payment.specialLoanFine;

    return {
      memberId: payment.memberId.toString(),

      memberCode: member?.memberCode ?? "",

      memberName: member?.name ?? "",

      contribution: payment.contribution,

      loanRepayment: payment.loanRepayment,

      absentFine: payment.absentFine,

      specialLoanFine: payment.specialLoanFine,

      remarks: payment.remarks,

      total,

      contributionDue: memberDues.contributionDue,

      absentFineDue: memberDues.absentFineDue,
    };
  });

  return createSummary(meetingId, meeting.status, records, true);
}
