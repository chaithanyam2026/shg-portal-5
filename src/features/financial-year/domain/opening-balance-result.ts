import type { MemberOpeningBalance } from "./member-opening-balance";
import type { OpeningBalance } from "./opening-balance";

/**
 * Result returned by the opening balance generator.
 */
export type OpeningBalanceResult = {
  generatedAt: Date;
  summary: {
    opening: OpeningBalance;
    members: MemberOpeningBalance[];
  };
};
