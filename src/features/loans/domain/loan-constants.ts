export const DEFAULT_LOAN_INTEREST_RATE = 10;

export const OPENING_BALANCE_MIGRATION_REMARK = "Opening balance migration";

export function isOpeningBalanceMigrationLoan(remarks: string): boolean {
  return remarks.includes(OPENING_BALANCE_MIGRATION_REMARK);
}
