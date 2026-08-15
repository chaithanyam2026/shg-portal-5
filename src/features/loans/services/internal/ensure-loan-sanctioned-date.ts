type LoanDateFields = {
  sanctionedDate?: Date | null;
  disbursedDate: Date;
};

/**
 * Backfills sanctionedDate for legacy loans created before the field existed.
 */
export function ensureLoanSanctionedDate(loan: LoanDateFields): void {
  if (!loan.sanctionedDate) {
    loan.sanctionedDate = loan.disbursedDate;
  }
}
