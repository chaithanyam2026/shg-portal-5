import type {
  PropsWithChildren,
} from "react";

import AppLayout from "@/components/layout/AppLayout";

type Props =
  PropsWithChildren;

/**
 * Shared layout for all dashboard pages.
 */
export default function DashboardLayout({
  children,
}: Props) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}