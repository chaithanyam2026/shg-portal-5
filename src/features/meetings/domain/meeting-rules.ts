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

export function isEditable(status: string) {
  return status !== MEETING_STATUS.CLOSED;
}

export function isDeletable(status: string) {
  return status === MEETING_STATUS.DRAFT;
}