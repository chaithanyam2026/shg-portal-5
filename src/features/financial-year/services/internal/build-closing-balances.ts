import type {
  FinancialYearClosingMember,
  FinancialYearClosingSummary,
} from "@/models/FinancialYear";

export interface BuildClosingBalancesInput {
  bankBalance: number;

  cashInHand: number;

  excessCorpus: number;

  investments: number;

  memberBalances: FinancialYearClosingMember[];
}

export function buildClosingBalances(
  input: BuildClosingBalancesInput,
): FinancialYearClosingSummary {
  const {
    bankBalance,
    cashInHand,
    excessCorpus,
    investments,
    memberBalances,
  } = input;

  const totalAssets =
    bankBalance +
    cashInHand +
    excessCorpus +
    investments;

  const totalLiabilities =
    memberBalances.reduce(
      (total, member) =>
        total + member.totalOutstanding,
      0,
    );

  return {
    bankBalance,

    cashInHand,

    excessCorpus,

    investments,

    totalAssets,

    totalLiabilities,
  };
}