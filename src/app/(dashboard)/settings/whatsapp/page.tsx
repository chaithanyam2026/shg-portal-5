import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getWhatsappSettings } from "@/features/settings/services";
import WhatsappSettingsForm from "@/features/settings/ui/WhatsappSettingsForm";
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

  const settings = await getWhatsappSettings();

  return <WhatsappSettingsForm enabled={settings.whatsappMeetingCloseEnabled} />;
}
