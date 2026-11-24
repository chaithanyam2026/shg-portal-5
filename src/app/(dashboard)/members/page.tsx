import { auth } from "@/auth";
import { listMembers } from "@/features/members/services";
import { canCurrentUserAccessFinancialStewardArea } from "@/features/financial-year/services";

import MemberList from "@/features/members/ui/MemberList";
import { isAdminRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [members, canManageMembers, session] = await Promise.all([
    listMembers(),
    canCurrentUserAccessFinancialStewardArea(),
    auth(),
  ]);

  return (
    <MemberList
      members={members}
      canManageMembers={canManageMembers}
      canResetPassword={isAdminRole(session?.user?.role)}
    />
  );
}
