"use client";

import type {
  AttendanceFineSummary,
} from "@/features/reports/domain";

import type {
  MemberDetails as MemberDetailsType,
} from "../types";

import MemberTabs from "./MemberTabs";

type Props = {
  member: MemberDetailsType;

  attendanceFine: AttendanceFineSummary;
};

/**
 * Member details page.
 *
 * Displays the member information
 * using a tabbed interface.
 */
export default function MemberDetails({
  member,
  attendanceFine,
}: Props) {
  return (
    <MemberTabs
      member={member}
      attendanceFine={attendanceFine}
    />
  );
}