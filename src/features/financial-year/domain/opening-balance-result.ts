import type { OpeningBalanceSummary } from "./opening-balance-summary";

/**
 * Result returned by the
 * opening balance generator.
 */
export type OpeningBalanceResult = {
  generatedAt: Date;
  summary: OpeningBalanceSummary;
};
