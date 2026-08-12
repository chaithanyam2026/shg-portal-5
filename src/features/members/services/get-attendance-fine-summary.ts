import type { AttendanceFineSummary } from "@/features/reports/domain";
import { getMemberAttendanceFine } from "@/features/reports/services/get-member-attendance-fine";
import { getActiveFinancialYear } from "@/features/financial-year/services/get-active";

import { getMember } from "./get";

function createEmptyAttendanceFineSummary(member: {
  _id: string;
  memberCode: string;
  name: string;
}): AttendanceFineSummary {
  return {
    memberId: member._id,
    memberCode: member.memberCode,
    memberName: member.name,
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
    attendancePercentage: 0,
    totalFine: 0,
    paidFine: 0,
    pendingFine: 0,
    entries: [],
  };
}

/**
 * Returns the attendance fine ledger for a member
 * in the active financial year.
 */
export async function getAttendanceFineSummary(
  memberId: string,
  financialYearId?: string,
): Promise<AttendanceFineSummary> {
  const member = await getMember(memberId);

  let selectedFinancialYearId = financialYearId;

  if (!selectedFinancialYearId) {
    const financialYear = await getActiveFinancialYear();

    if (!financialYear) {
      return createEmptyAttendanceFineSummary(member);
    }

    selectedFinancialYearId = financialYear._id.toString();
  }

  try {
    return await getMemberAttendanceFine(selectedFinancialYearId, memberId);
  } catch {
    return createEmptyAttendanceFineSummary(member);
  }
}
