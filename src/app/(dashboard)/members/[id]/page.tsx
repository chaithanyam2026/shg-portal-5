import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getCurrentLoanViewScope } from "@/features/loans/services";
import { canCurrentUserAccessFinancialStewardArea } from "@/features/financial-year/services";
import {
  getDefaultMemberFinancialYearId,
  getMember,
  listMemberFinancialYearOptions,
} from "@/features/members/services";
import MemberTabs from "@/features/members/ui/MemberTabs";
import { isAdminRole } from "@/lib/auth/roles";
import { getCurrentMemberId } from "@/lib/auth/current-member";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  try {
    const [
      member,
      financialYearOptions,
      loanViewScope,
      currentMemberId,
      canManageMembers,
      session,
    ] = await Promise.all([
      getMember(id),
      listMemberFinancialYearOptions(id),
      getCurrentLoanViewScope(),
      getCurrentMemberId(),
      canCurrentUserAccessFinancialStewardArea(),
      auth(),
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
        canResetPassword={isAdminRole(session?.user?.role)}
      />
    );
  } catch {
    notFound();
  }
}
