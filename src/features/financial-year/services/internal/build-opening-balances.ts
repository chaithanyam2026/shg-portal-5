import type {
  FinancialYearClosing,
  FinancialYearMemberOpening,
  OpeningBalance,
} from "@/models/FinancialYear";

import { buildMemberOpeningBalances } from "./build-member-opening-balances";

export interface OpeningBalanceResult {
  generatedAt: Date;

  summary: {
    openingBalances: OpeningBalance;

    members: FinancialYearMemberOpening[];
  };
}

function createEmptyOpeningBalances(): OpeningBalance {
  return {
    bankBalance: 0,

    cashInHand: 0,

    excessCorpus: 0,

    investments: 0,

    otherLoans: 0,
  };
}

export function buildOpeningBalances(
  closing: FinancialYearClosing | null,
): OpeningBalanceResult {
  if (!closing) {
    return {
      generatedAt: new Date(),

      summary: {
        openingBalances: createEmptyOpeningBalances(),

        members: [],
      },
    };
  }

  return {
    generatedAt: new Date(),

    summary: {
      openingBalances: {
        bankBalance: closing.summary.bankBalance,

        cashInHand: closing.summary.cashInHand,

        excessCorpus: closing.summary.excessCorpus,

        investments: closing.summary.investments,

        otherLoans: 0,
      },

      members: buildMemberOpeningBalances(closing),
    },
  };
}