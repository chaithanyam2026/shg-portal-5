import type { PropsWithChildren } from "react";

import { auth } from "@/auth";

import AppLayout from "@/components/layout/AppLayout";
import PageLayout from "@/components/layout/PageLayout";
import type { UserRole } from "@/lib/auth/roles";

type Props = PropsWithChildren;

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();

  return (
    <AppLayout
      username={session?.user.username}
      userRole={(session?.user.role as UserRole | undefined) ?? "MEMBER"}
    >
      <PageLayout>{children}</PageLayout>
    </AppLayout>
  );
}
