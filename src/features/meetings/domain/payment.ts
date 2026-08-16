export const WEEKLY_CONTRIBUTION = 200;

export type PaymentAmountRemainder = {
  pending: number;
  excess: number;
};

/**
 * Amount still pending or already in excess after the entered payment.
 * `due` may be negative when previous meetings were overpaid.
 */
export function paymentAmountRemainder(due: number, entered: number): PaymentAmountRemainder {
  const remaining = due - entered;

  return {
    pending: Math.max(0, remaining),
    excess: Math.max(0, -remaining),
  };
}
