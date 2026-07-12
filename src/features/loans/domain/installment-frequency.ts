export const INSTALLMENT_FREQUENCY = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;

export const INSTALLMENT_FREQUENCY_VALUES =
  Object.values(INSTALLMENT_FREQUENCY);

export type InstallmentFrequency =
  (typeof INSTALLMENT_FREQUENCY_VALUES)[number];