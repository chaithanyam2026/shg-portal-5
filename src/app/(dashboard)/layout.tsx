import type { PropsWithChildren } from "react";

import { auth } from "@/auth";

import AppLayout from "@/components/layout/AppLayout";
import PageLayout from "@/components/layout/PageLayout";
import SessionActivityTracker from "@/features/auth/ui/SessionActivityTracker";
import { getAccountProfile } from "@/features/members/services/get-account-profile";
import { isCurrentUserFinancialYearOfficeBearer } from "@/features/financial-year/services";
import { getDashboardNavLinks } from "@/lib/navigation";
import type { UserRole } from "@/lib/auth/roles";

type Props = PropsWithChildren;

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();
  const userRole = (session?.user.role as UserRole | undefined) ?? "MEMBER";

  let displayName = session?.user.username ?? "";
  let isOfficeBearer = false;

  if (session?.user.id) {
    try {
      isOfficeBearer = await isCurrentUserFinancialYearOfficeBearer();
    } catch {
      isOfficeBearer = false;
    }

    try {
      const profile = await getAccountProfile(session.user.id);
      displayName = profile.name;
    } catch {
      // Admin or other accounts without a linked member keep the username.
    }
  }

  const navItems = getDashboardNavLinks(userRole, isOfficeBearer);

  return (
    <AppLayout displayName={displayName} navItems={navItems}>
      <SessionActivityTracker />
      <PageLayout>{children}</PageLayout>
    </AppLayout>
  );
}
