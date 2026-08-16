import { isAdminRole } from "@/lib/auth/roles";
import { FINANCIAL_YEAR_STATUS } from "@/features/financial-year/domain/financial-year-status";

import { MEETING_STATUS } from "./meeting-status";

export function canStartMeeting(status: string) {
  return status === MEETING_STATUS.DRAFT;
}

export function canApproveMeeting(status: string) {
  return status === MEETING_STATUS.IN_PROGRESS;
}

export function canCloseMeeting(status: string) {
  return status === MEETING_STATUS.APPROVED;
}

export function isEditable(
  meetingStatus: string,
  financialYearStatus?: string,
  role?: string | null,
) {
  if (isAdminRole(role)) {
    return true;
  }

  if (meetingStatus === MEETING_STATUS.CLOSED) {
    return false;
  }

  if (financialYearStatus === FINANCIAL_YEAR_STATUS.CLOSED) {
    return false;
  }

  return true;
}

export function canReopenMeeting(status: string, role?: string | null) {
  return isAdminRole(role) && status === MEETING_STATUS.CLOSED;
}

export function isDeletable(status: string, role?: string | null) {
  if (status === MEETING_STATUS.DRAFT) {
    return true;
  }

  return isAdminRole(role) && status === MEETING_STATUS.CLOSED;
}
