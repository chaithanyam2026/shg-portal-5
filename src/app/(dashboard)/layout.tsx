import type { PropsWithChildren } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageLayout from "@/components/layout/PageLayout";

type Props = PropsWithChildren;

/**
 * Shared layout for all dashboard pages.
 */
export default function DashboardLayout({ children }: Props) {
  return (
    <AppLayout>
      <PageLayout>{children}</PageLayout>
    </AppLayout>
  );
}
