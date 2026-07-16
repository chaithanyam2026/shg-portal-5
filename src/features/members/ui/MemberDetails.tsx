"use client";

import type {
  MemberDetails as MemberDetailsType,
} from "../types";

import MemberTabs from "./MemberTabs";

type Props = {
  member: MemberDetailsType;
};

/**
 * Member details page.
 *
 * Displays the member information
 * using a tabbed interface.
 */
export default function MemberDetails({
  member,
}: Props) {
  return (
    <MemberTabs
      member={member}
    />
  );
}