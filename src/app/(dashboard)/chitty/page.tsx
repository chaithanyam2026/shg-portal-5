import { redirect } from "next/navigation";

import { auth } from "@/auth";
import PageHeader from "@/components/layout/PageHeader";
import { getChittyPayments } from "@/features/chitty/services";
import ChittyDashboard from "@/features/chitty/ui/ChittyDashboard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const sheet = await getChittyPayments();

  return (
    <>
      <PageHeader
        title="Chitty Payment"
        showBack={false}
        subtitle="Weekly chitty payment tracking"
      />
      <ChittyDashboard initialSheet={sheet} />
    </>
  );
}
