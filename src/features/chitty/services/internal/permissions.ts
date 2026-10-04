import {
  CHITTY_PAYMENT_LOCK_LABEL,
  canCloseChittyDay,
  canEditChittyDisbursement,
  canEditChittySheet,
  canViewAllChittyRows,
  chittyEditBlockReason,
  isAfterChittyPaymentCutoff,
  isCurrentChittySunday,
  type ChittyEditorRole,
} from "../../domain";
import type { ChittyStatus } from "../../domain/chitty-status";

export function sheetPermissions(input: {
  role: ChittyEditorRole;
  schemeStatus: ChittyStatus;
  dayClosed: boolean;
  sheetDate: Date;
  now: Date;
}) {
  const schemeClosed = input.schemeStatus === "CLOSED";
  const isCurrentSunday = isCurrentChittySunday(input.now, input.sheetDate);
  const afterCutoff = isAfterChittyPaymentCutoff(input.now, input.sheetDate);
  const flags = {
    role: input.role,
    schemeClosed,
    dayClosed: input.dayClosed,
    isCurrentSunday,
    afterCutoff,
  };

  return {
    schemeClosed,
    canEditPayments: canEditChittySheet(flags),
    canEditAll: canViewAllChittyRows(input.role),
    canEditDisbursement: canEditChittyDisbursement(flags),
    canCloseDay: canCloseChittyDay(flags),
    blockReason: chittyEditBlockReason({
      ...flags,
      lockLabel: CHITTY_PAYMENT_LOCK_LABEL,
    }),
  };
}
