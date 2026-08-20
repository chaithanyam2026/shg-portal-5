export function canEditChittyPaymentRow(input: {
  sheetLocked: boolean;
  canEditAll: boolean;
  currentMemberId: string | null;
  rowMemberId: string;
}): boolean {
  if (input.sheetLocked) {
    return false;
  }

  if (input.canEditAll) {
    return true;
  }

  return Boolean(input.currentMemberId) && input.currentMemberId === input.rowMemberId;
}
