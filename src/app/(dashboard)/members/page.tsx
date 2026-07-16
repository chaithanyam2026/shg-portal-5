import {
  listMembers,
} from "@/features/members/services";

import MemberList from "@/features/members/ui/MemberList";

export const dynamic =
  "force-dynamic";

export default async function Page() {
  const members =
    await listMembers();

  return (
    <MemberList
      members={members}
    />
  );
}