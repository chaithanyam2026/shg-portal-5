/**
 * Validation result before
 * closing a financial year.
 */
export type ClosingValidationItem = {
  code: string;

  title: string;

  valid: boolean;

  message: string;
};

export type ClosingValidation = {
  valid: boolean;

  items: ClosingValidationItem[];
};
