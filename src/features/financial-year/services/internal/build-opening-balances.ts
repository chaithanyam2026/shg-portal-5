import type {
  FinancialYearClosing,
  OpeningBalance,
} from "@/models/FinancialYear";

import type { OpeningBalanceResult } from "../../domain";

import { buildMemberOpeningBalances } from "./build-member-opening-balances";

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
        opening: createEmptyOpeningBalances(),

        members: [],
      },
    };
  }

  return {
    generatedAt: new Date(),

    summary: {
      opening: {
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
