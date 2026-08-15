import type { PropsWithChildren } from "react";

import { auth } from "@/auth";

import AppLayout from "@/components/layout/AppLayout";
import PageLayout from "@/components/layout/PageLayout";
import { getAccountProfile } from "@/features/members/services/get-account-profile";
import type { UserRole } from "@/lib/auth/roles";

type Props = PropsWithChildren;

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();

  let displayName = session?.user.username ?? "";

  if (session?.user.id) {
    try {
      const profile = await getAccountProfile(session.user.id);
      displayName = profile.name;
    } catch {
      // Admin or other accounts without a linked member keep the username.
    }
  }

  return (
    <AppLayout
      displayName={displayName}
      userRole={(session?.user.role as UserRole | undefined) ?? "MEMBER"}
    >
      <PageLayout>{children}</PageLayout>
    </AppLayout>
  );
}
