import { notFound } from "next/navigation";

import { canCurrentUserViewAllLoans } from "@/features/loans/services";
import { canViewLoanDetails } from "@/features/loans/domain";
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
    const [member, financialYearOptions, canViewAllLoans, currentMemberId, canManageMembers] =
      await Promise.all([
        getMember(id),
        listMemberFinancialYearOptions(id),
        canCurrentUserViewAllLoans(),
        getCurrentMemberId(),
        canCurrentUserAccessFinancialStewardArea(),
      ]);

    const initialFinancialYearId = getDefaultMemberFinancialYearId(financialYearOptions) ?? "";

    return (
      <MemberTabs
        member={member}
        financialYearOptions={financialYearOptions}
        initialFinancialYearId={initialFinancialYearId}
        canViewLoanDetails={canViewLoanDetails({
          loanMemberId: member._id,
          currentMemberId,
          canViewAllLoans,
        })}
        canManageMembers={canManageMembers}
      />
    );
  } catch {
    notFound();
  }
}
