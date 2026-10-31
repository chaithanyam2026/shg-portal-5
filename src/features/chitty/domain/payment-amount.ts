import { collectedAmount, roundMoney } from "./week-balance";

export const CHITTY_INSTALLMENT_PAYMENT = "installment" as const;

export type ChittyPaymentMode = typeof CHITTY_INSTALLMENT_PAYMENT;

export type ChittyStoredEntryAmounts = {
  cash?: number;
  gpay?: number;
  paymentMode?: ChittyPaymentMode | null;
  paid?: boolean;
  previousBalancePayment?: number;
  auctionAmount?: number;
};

export function chittyEntryAmount(entry: ChittyStoredEntryAmounts, weeklyAmount: number): number {
  if (entry.paymentMode === CHITTY_INSTALLMENT_PAYMENT) {
    return roundMoney((entry.paid ? weeklyAmount : 0) + (entry.previousBalancePayment ?? 0));
  }

  return collectedAmount(entry.cash ?? 0, entry.gpay ?? 0);
}

export function pendingBalanceBefore(
  priorEntries: ChittyStoredEntryAmounts[],
  weeklyAmount: number,
): number {
  let balance = 0;

  for (const entry of priorEntries) {
    balance = roundMoney(balance + weeklyAmount - chittyEntryAmount(entry, weeklyAmount));
  }

  return Math.max(0, balance);
}

export function payablePreviousBalance(
  pendingBalance: number,
  previousBalancePayment: number,
): number {
  if (pendingBalance <= 0) {
    return 0;
  }

  return roundMoney(Math.min(Math.max(0, previousBalancePayment), pendingBalance));
}

export function userPaymentAmount(
  paid: boolean,
  weeklyAmount: number,
  pendingBalance: number,
  previousBalancePayment: number,
): number {
  return roundMoney(
    (paid ? weeklyAmount : 0) + payablePreviousBalance(pendingBalance, previousBalancePayment),
  );
}

export function presentPayment(
  entry: ChittyStoredEntryAmounts | undefined,
  weeklyAmount: number,
  pendingBalance: number,
): { paid: boolean; previousBalancePayment: number; auctionAmount: number } {
  if (entry?.paymentMode === CHITTY_INSTALLMENT_PAYMENT) {
    return {
      paid: Boolean(entry.paid),
      previousBalancePayment: payablePreviousBalance(
        pendingBalance,
        entry.previousBalancePayment ?? 0,
      ),
      auctionAmount: roundMoney(entry.auctionAmount ?? 0),
    };
  }

  const legacy = collectedAmount(entry?.cash ?? 0, entry?.gpay ?? 0);
  const paid = weeklyAmount > 0 && legacy >= roundMoney(weeklyAmount);
  const remainder = roundMoney(Math.max(0, legacy - (paid ? weeklyAmount : 0)));

  return {
    paid,
    previousBalancePayment: payablePreviousBalance(pendingBalance, remainder),
    auctionAmount: 0,
  };
}
