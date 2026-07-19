export const EXPENSE_CATEGORY = {
  STATIONERY: "STATIONERY",
  REFRESHMENTS: "REFRESHMENTS",
  BANK_CHARGES: "BANK_CHARGES",
  TRAVEL: "TRAVEL",
  ADMINISTRATIVE: "ADMINISTRATIVE",
  MISCELLANEOUS: "MISCELLANEOUS",
} as const;

export const EXPENSE_CATEGORY_VALUES = Object.values(EXPENSE_CATEGORY);

export type ExpenseCategory = (typeof EXPENSE_CATEGORY_VALUES)[number];

export const EXPENSE_CATEGORY_OPTIONS = [
  {
    value: EXPENSE_CATEGORY.STATIONERY,
    label: "Stationery",
  },
  {
    value: EXPENSE_CATEGORY.REFRESHMENTS,
    label: "Refreshments",
  },
  {
    value: EXPENSE_CATEGORY.BANK_CHARGES,
    label: "Bank Charges",
  },
  {
    value: EXPENSE_CATEGORY.TRAVEL,
    label: "Travel",
  },
  {
    value: EXPENSE_CATEGORY.ADMINISTRATIVE,
    label: "Administrative",
  },
  {
    value: EXPENSE_CATEGORY.MISCELLANEOUS,
    label: "Miscellaneous",
  },
] as const;
