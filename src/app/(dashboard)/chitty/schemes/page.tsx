import { redirect } from "next/navigation";

import { auth } from "@/auth";
import PageHeader from "@/components/layout/PageHeader";
import { listChittySchemes } from "@/features/chitty/services";
import ChittySchemesManager from "@/features/chitty/ui/ChittySchemesManager";
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

  const schemes = await listChittySchemes();

  return (
    <>
      <PageHeader title="Chitty schemes" subtitle="Create a chitty and set it active or closed" />
      <ChittySchemesManager initialSchemes={schemes} />
    </>
  );
}
