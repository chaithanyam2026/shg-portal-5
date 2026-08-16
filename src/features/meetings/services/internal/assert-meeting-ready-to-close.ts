import { AppError } from "@/lib/errors";

import { getMeetingCloseBlockers } from "../../domain/meeting-close";
import { loadFinancialYearMembers } from "./load-financial-year-members";

export async function assertMeetingReadyToClose(meeting: {
  financialYearId: { toString(): string };
  attendance?: unknown[];
  payments?: unknown[];
}): Promise<void> {
  const members = await loadFinancialYearMembers(meeting.financialYearId.toString());
  const blockers = getMeetingCloseBlockers({
    expectedMemberCount: members.length,
    attendanceCount: meeting.attendance?.length ?? 0,
    paymentCount: meeting.payments?.length ?? 0,
  });

  if (blockers.length > 0) {
    throw new AppError(blockers[0], 400);
  }
}
