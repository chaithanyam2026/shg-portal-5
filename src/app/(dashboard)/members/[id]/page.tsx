import { notFound } from "next/navigation";

import { getCurrentLoanViewScope } from "@/features/loans/services";
import { canCurrentUserAccessFinancialStewardArea } from "@/features/financial-year/services";
import {
  getDefaultMemberFinancialYearId,
  getMember,
  listMemberFinancialYearOptions,
} from "@/features/members/services";
import MemberTabs from "@/features/members/ui/MemberTabs";
import { getCurrentMemberId } from "@/lib/auth/current-member";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  try {
    const [member, financialYearOptions, loanViewScope, currentMemberId, canManageMembers] =
      await Promise.all([
        getMember(id),
        listMemberFinancialYearOptions(id),
        getCurrentLoanViewScope(),
        getCurrentMemberId(),
        canCurrentUserAccessFinancialStewardArea(),
      ]);

    const initialFinancialYearId = getDefaultMemberFinancialYearId(financialYearOptions) ?? "";

    return (
      <MemberTabs
        member={member}
        financialYearOptions={financialYearOptions}
        initialFinancialYearId={initialFinancialYearId}
        canViewAllFinancialYears={loanViewScope.canViewAllFinancialYears}
        officeBearerFinancialYearIds={loanViewScope.officeBearerFinancialYearIds}
        currentMemberId={currentMemberId}
        canManageMembers={canManageMembers}
      />
    );
  } catch {
    notFound();
  }
}
