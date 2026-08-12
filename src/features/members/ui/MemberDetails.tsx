"use client";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import type { MemberDetails as MemberDetailsType } from "../types";

import MemberTabs from "./MemberTabs";

type Props = {
  financialYearOptions: FinancialYearOption[];

  initialFinancialYearId: string;

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
  financialYearOptions,
  initialFinancialYearId,
}: Props) {
  return (
    <MemberTabs
      member={member}
      financialYearOptions={financialYearOptions}
      initialFinancialYearId={initialFinancialYearId}
    />
  );
}
