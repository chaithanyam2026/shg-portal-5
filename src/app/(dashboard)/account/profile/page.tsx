import AccountProfileForm from "@/features/auth/ui/AccountProfileForm";
import AccountProfileUnavailable from "@/features/auth/ui/AccountProfileUnavailable";
import { getAccountProfile } from "@/features/members/services/get-account-profile";
import { AppError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireAuth();

  try {
    const profile = await getAccountProfile(session.user.id);

    return <AccountProfileForm initialProfile={profile} />;
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      return <AccountProfileUnavailable />;
    }

    throw error;
  }
}
