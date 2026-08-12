export const INCOME_CATEGORY = {
  BANK_INTEREST: "BANK_INTEREST",
  DONATION: "DONATION",
  REGISTRATION_FEE: "REGISTRATION_FEE",
  PENALTY: "PENALTY",
  MISCELLANEOUS: "MISCELLANEOUS",
} as const;

export const INCOME_CATEGORY_VALUES = [
  INCOME_CATEGORY.BANK_INTEREST,
  INCOME_CATEGORY.DONATION,
  INCOME_CATEGORY.REGISTRATION_FEE,
  INCOME_CATEGORY.PENALTY,
  INCOME_CATEGORY.MISCELLANEOUS,
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORY_VALUES)[number];

export const INCOME_CATEGORY_OPTIONS = [
  {
    value: INCOME_CATEGORY.BANK_INTEREST,
    label: "Bank Interest",
  },
  {
    value: INCOME_CATEGORY.DONATION,
    label: "Donation",
  },
  {
    value: INCOME_CATEGORY.REGISTRATION_FEE,
    label: "Registration Fee",
  },
  {
    value: INCOME_CATEGORY.PENALTY,
    label: "Penalty",
  },
  {
    value: INCOME_CATEGORY.MISCELLANEOUS,
    label: "Miscellaneous",
  },
] as const;
