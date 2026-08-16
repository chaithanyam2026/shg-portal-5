import { listMembers } from "@/features/members/services";
import { canCurrentUserAccessFinancialStewardArea } from "@/features/financial-year/services";

import MemberList from "@/features/members/ui/MemberList";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [members, canManageMembers] = await Promise.all([
    listMembers(),
    canCurrentUserAccessFinancialStewardArea(),
  ]);

  return <MemberList members={members} canManageMembers={canManageMembers} />;
}
