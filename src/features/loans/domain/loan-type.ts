/**
 * Loan categories supported by the SHG.
 *
 * NORMAL
 *   Regular member loan.
 *
 * SPECIAL
 *   Special/emergency loan.
 *
 * Business Rules
 * --------------
 * - A member can have only ONE ACTIVE NORMAL loan.
 * - A member can have only ONE ACTIVE SPECIAL loan.
 * - A member may have one ACTIVE NORMAL loan and one
 *   ACTIVE SPECIAL loan simultaneously.
 */
export const LOAN_TYPES = ["NORMAL", "SPECIAL"] as const;

export type LoanType = (typeof LOAN_TYPES)[number];

export const NORMAL_LOAN_TYPE = "NORMAL";

export const SPECIAL_LOAN_TYPE = "SPECIAL";

export function isNormalLoan(loanType: LoanType): boolean {
  return loanType === NORMAL_LOAN_TYPE;
}

export function isSpecialLoan(loanType: LoanType): boolean {
  return loanType === SPECIAL_LOAN_TYPE;
}
