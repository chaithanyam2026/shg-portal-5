import { Types } from "mongoose";

import { OPENING_BALANCE_MIGRATION_REMARK } from "@/features/loans/domain/loan-constants";
import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";
import Loan from "@/models/Loan";
import Member from "@/models/Member";

type BuildLoanDisbursementEntriesInput = {
  financialYearId: string;
  closedMeetingIds: ReadonlySet<string>;
};

export async function buildLoanDisbursementEntries(
  input: BuildLoanDisbursementEntriesInput,
): Promise<LedgerEntry[]> {
  const loans = await Loan.find({
    financialYearId: new Types.ObjectId(input.financialYearId),
    remarks: {
      $ne: OPENING_BALANCE_MIGRATION_REMARK,
    },
  })
    .select({
      loanNumber: 1,
      memberId: 1,
      disbursedAmount: 1,
      disbursedDate: 1,
      meetingId: 1,
    })
    .lean()
    .exec();

  if (loans.length === 0) {
    return [];
  }

  const memberIds = [...new Set(loans.map((loan) => loan.memberId.toString()))];

  const members = await Member.find({
    _id: {
      $in: memberIds.map((memberId) => new Types.ObjectId(memberId)),
    },
  })
    .select({
      memberCode: 1,
      name: 1,
    })
    .lean()
    .exec();

  const memberById = new Map(members.map((member) => [member._id.toString(), member]));

  const entries: LedgerEntry[] = [];

  for (const loan of loans) {
    if (loan.meetingId) {
      const meetingId = loan.meetingId.toString();

      if (!input.closedMeetingIds.has(meetingId)) {
        continue;
      }
    }

    const member = memberById.get(loan.memberId.toString());

    entries.push({
      date: loan.disbursedDate,
      transactionType: LEDGER_TRANSACTION_TYPE.LOAN_DISBURSEMENT,
      description: member
        ? `Loan ${loan.loanNumber} — ${member.memberCode} ${member.name}`
        : `Loan ${loan.loanNumber}`,
      income: 0,
      expense: loan.disbursedAmount,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: loan.meetingId?.toString(),
      referenceId: loan._id.toString(),
    });
  }

  return entries;
}
