"use client";

import { Typography } from "@mui/material";

import { formatCurrency } from "@/lib/utils/format";

import { paymentAmountRemainder } from "../domain/payment";

type Props = {
  due: number;
  entered: number;
};

export default function PaymentBalanceHint({ due, entered }: Props) {
  const { pending, excess } = paymentAmountRemainder(due, entered);

  if (pending > 0) {
    return (
      <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: "block" }}>
        {`Pending ${formatCurrency(pending)}`}
      </Typography>
    );
  }

  if (excess > 0) {
    return (
      <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: "block" }}>
        {`Excess ${formatCurrency(excess)}`}
      </Typography>
    );
  }

  return (
    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>

    </Typography>
  );
}
