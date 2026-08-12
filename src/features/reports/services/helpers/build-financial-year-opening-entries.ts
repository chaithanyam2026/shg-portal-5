import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

type MemberOpening = {
  contribution: number;
  loan: number;
  specialLoan: number;
};

type BuildFinancialYearOpeningEntriesInput = {
  financialYearId: string;
  startDate: Date;
  members: {
    opening: MemberOpening;
  }[];
};

export function buildFinancialYearOpeningEntries(
  input: BuildFinancialYearOpeningEntriesInput,
): LedgerEntry[] {
  const totalContribution = input.members.reduce(
    (total, member) => total + (member.opening?.contribution ?? 0),
    0,
  );

  const totalLoan = input.members.reduce(
    (total, member) => total + (member.opening?.loan ?? 0),
    0,
  );

  const totalSpecialLoan = input.members.reduce(
    (total, member) => total + (member.opening?.specialLoan ?? 0),
    0,
  );

  const entries: LedgerEntry[] = [];

  if (totalContribution > 0) {
    entries.push({
      date: input.startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.CONTRIBUTION,
      description: "Opening Member Contribution",
      income: totalContribution,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: input.financialYearId,
    });
  }

  if (totalLoan > 0) {
    entries.push({
      date: input.startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.LOAN_DISBURSEMENT,
      description: "Opening Member Loan",
      income: 0,
      expense: totalLoan,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: input.financialYearId,
    });
  }

  if (totalSpecialLoan > 0) {
    entries.push({
      date: input.startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.LOAN_DISBURSEMENT,
      description: "Opening Special Loan",
      income: 0,
      expense: totalSpecialLoan,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: input.financialYearId,
    });
  }

  return entries;
}
