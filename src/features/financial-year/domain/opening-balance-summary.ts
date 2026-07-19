import type { OpeningBalance } from "./opening-balance";

import type { MemberOpeningBalance } from "./member-opening-balance";

/**
 * Complete opening balance
 * snapshot for creating the
 * next financial year.
 */
export type OpeningBalanceSummary = {
  financialYearId: string;

  financialYearName: string;

  sourceClosedAt: Date;

  opening: OpeningBalance;

  members: MemberOpeningBalance[];
};
