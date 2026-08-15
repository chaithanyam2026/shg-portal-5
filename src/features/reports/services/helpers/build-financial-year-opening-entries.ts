import type { OpeningBalance } from "@/features/financial-year/domain/opening-balance";
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
  openingBalances: OpeningBalance;
  members: {
    opening: MemberOpening;
  }[];
};

export function buildFinancialYearOpeningEntries(
  input: BuildFinancialYearOpeningEntriesInput,
): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  const { openingBalances, startDate, financialYearId, members } = input;

  const totalContribution = members.reduce(
    (total, member) => total + (member.opening?.contribution ?? 0),
    0,
  );

  const totalLoan = members.reduce(
    (total, member) => total + (member.opening?.loan ?? 0),
    0,
  );

  const totalSpecialLoan = members.reduce(
    (total, member) => total + (member.opening?.specialLoan ?? 0),
    0,
  );

  if (totalContribution > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_CONTRIBUTION,
      description: "Initial Contribution",
      income: totalContribution,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  if (totalLoan > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_LOAN,
      description: "Initial Loan",
      income: 0,
      expense: totalLoan,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  if (totalSpecialLoan > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_SPECIAL_LOAN,
      description: "Initial Special Loan",
      income: 0,
      expense: totalSpecialLoan,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  if (openingBalances.excessCorpus > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_EXCESS_CORPUS,
      description: "Excess Corpus",
      income: openingBalances.excessCorpus,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  if (openingBalances.bankBalance > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_BANK_BALANCE,
      description: "Initial Bank Balance",
      income: 0,
      expense: openingBalances.bankBalance,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  if (openingBalances.investments > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_INVESTMENTS,
      description: "Initial Investments",
      income: 0,
      expense: openingBalances.investments,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  if (openingBalances.cashInHand > 0) {
    entries.push({
      date: startDate,
      transactionType: LEDGER_TRANSACTION_TYPE.OPENING_CASH_IN_HAND,
      description: "Initial Cash In Hand",
      income: 0,
      expense: openingBalances.cashInHand,
      cashInHand: 0,
      bankBalance: 0,
      referenceId: financialYearId,
    });
  }

  return entries;
}
