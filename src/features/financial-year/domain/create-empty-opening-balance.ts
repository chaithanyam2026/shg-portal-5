import type { OpeningBalanceResult } from "./opening-balance-result";

export function createEmptyOpeningBalance(): OpeningBalanceResult {
  return {
    generatedAt: new Date(),
    summary: {
      opening: {
        bankBalance: 0,
        cashInHand: 0,
        excessCorpus: 0,
        investments: 0,
        otherLoans: 0,
      },
      members: [],
    },
  };
}
