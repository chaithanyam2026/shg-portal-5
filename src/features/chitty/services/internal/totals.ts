import type { ChittyPaymentRecord, ChittyPaymentTotals } from "../../types";

export function emptyPaymentEntry() {
  return {
    cash: 0,
    gpay: 0,
    gpayChecked: false,
    missingCount: 0,
    remarks: "",
  };
}

export function sumChittyPaymentTotals(records: ChittyPaymentRecord[]): ChittyPaymentTotals {
  return records.reduce(
    (totals, record) => ({
      cash: totals.cash + record.cash,
      gpay: totals.gpay + record.gpay,
      gpayChecked: totals.gpayChecked + (record.gpayChecked ? record.gpay : 0),
      missingCount: totals.missingCount + record.missingCount,
    }),
    { cash: 0, gpay: 0, gpayChecked: 0, missingCount: 0 },
  );
}
