import type { ClosingSummary } from "./closing-summary";

import type { ClosingValidation } from "./closing-validation";

import type { MemberClosingBalance } from "./member-closing-balance";

/**
 * Complete financial year
 * closing result.
 */
export type FinancialYearClose = {
  financialYearId: string;

  financialYearName: string;

  closedAt: string;

  summary: ClosingSummary;

  members: MemberClosingBalance[];

  validation: ClosingValidation;
};
