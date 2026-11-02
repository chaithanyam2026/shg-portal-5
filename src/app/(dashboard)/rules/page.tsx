import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getClubRules } from "@/features/rules/services";
import RulesDocumentView from "@/features/rules/ui/RulesDocumentView";
import { isAdminRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/forbidden");
  }

  return <RulesDocumentView rules={getClubRules()} />;
}
