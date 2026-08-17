import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { listLoginActivity } from "@/features/auth/services";
import LoginActivityView from "@/features/auth/ui/LoginActivityView";
import { isAdminRole } from "@/lib/auth/roles";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function Page({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/forbidden");
  }

  const { id } = await params;
  const activity = await listLoginActivity(id);

  return <LoginActivityView activity={activity} />;
}
