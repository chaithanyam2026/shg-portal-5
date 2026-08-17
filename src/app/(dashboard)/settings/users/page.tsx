import { auth } from "@/auth";
import { listUsers } from "@/features/auth/services";
import UserList from "@/features/auth/ui/UserList";
import { isAdminRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/forbidden");
  }

  const users = await listUsers();

  return <UserList users={users} currentUserId={session.user.id} />;
}
