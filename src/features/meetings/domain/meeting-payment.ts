import type { PaymentType } from "./payment-type";

export type MeetingPayment = {
  memberId: string;

  paymentType: PaymentType;

  amount: number;

  remarks?: string;
};
