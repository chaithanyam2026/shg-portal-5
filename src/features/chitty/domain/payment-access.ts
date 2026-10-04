import { isAdminRole, isChittyAdminRole } from "@/lib/auth/roles";

export type ChittyEditorRole = "admin" | "chitty_admin" | "member";

export function resolveChittyEditorRole(role?: string | null): ChittyEditorRole {
  if (isAdminRole(role)) {
    return "admin";
  }

  if (isChittyAdminRole(role)) {
    return "chitty_admin";
  }

  return "member";
}

export function canViewAllChittyRows(role: ChittyEditorRole): boolean {
  return role === "admin" || role === "chitty_admin";
}

export function canRecordChittyWin(role: ChittyEditorRole, schemeClosed: boolean): boolean {
  if (role === "admin") {
    return true;
  }

  return role === "chitty_admin" && !schemeClosed;
}

export function canEditChittySheet(input: {
  role: ChittyEditorRole;
  schemeClosed: boolean;
  dayClosed: boolean;
  isCurrentSunday: boolean;
  afterCutoff: boolean;
}): boolean {
  if (input.role === "admin") {
    return true;
  }

  if (input.schemeClosed || input.dayClosed || !input.isCurrentSunday) {
    return false;
  }

  if (input.role === "chitty_admin") {
    return true;
  }

  return !input.afterCutoff;
}

export function canEditChittyPaymentRow(input: {
  canEditSheet: boolean;
  canEditAll: boolean;
  currentMemberId: string | null;
  rowAgentMemberId: string;
}): boolean {
  if (!input.canEditSheet) {
    return false;
  }

  if (input.canEditAll) {
    return true;
  }

  return Boolean(input.currentMemberId) && input.currentMemberId === input.rowAgentMemberId;
}

export function canEditChittyDisbursement(input: {
  role: ChittyEditorRole;
  schemeClosed: boolean;
  dayClosed: boolean;
  isCurrentSunday: boolean;
}): boolean {
  if (input.role === "admin") {
    return true;
  }

  return (
    input.role === "chitty_admin" &&
    !input.schemeClosed &&
    !input.dayClosed &&
    input.isCurrentSunday
  );
}

export function canCloseChittyDay(input: {
  role: ChittyEditorRole;
  schemeClosed: boolean;
  dayClosed: boolean;
  isCurrentSunday: boolean;
}): boolean {
  if (input.dayClosed) {
    return false;
  }

  if (input.role === "admin") {
    return true;
  }

  return input.role === "chitty_admin" && !input.schemeClosed && input.isCurrentSunday;
}

export function chittyEditBlockReason(input: {
  role: ChittyEditorRole;
  schemeClosed: boolean;
  dayClosed: boolean;
  isCurrentSunday: boolean;
  afterCutoff: boolean;
  lockLabel: string;
}): string | null {
  if (canEditChittySheet(input)) {
    return null;
  }

  if (input.role !== "admin" && input.schemeClosed) {
    return "This chitty is closed. Only an admin can change it.";
  }

  if (input.role !== "admin" && input.dayClosed) {
    return "This Sunday is closed. Only an admin can change it.";
  }

  if (!input.isCurrentSunday) {
    return "Previous Sundays are read-only.";
  }

  return `Payment entry is closed after ${input.lockLabel}.`;
}
