import { notFound } from "next/navigation";

import { getMeeting } from "@/features/meetings/services/get";
import MeetingWorkspace from "@/features/meetings/ui/MeetingWorkspace";
import { canCurrentUserViewAllLoans } from "@/features/loans/services";
import { getCurrentMemberId } from "@/lib/auth/current-member";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function MeetingDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab } = await searchParams;

  try {
    const [meeting, canViewAllLoans, currentMemberId] = await Promise.all([
      getMeeting(id),
      canCurrentUserViewAllLoans(),
      getCurrentMemberId(),
    ]);

    return (
      <MeetingWorkspace
        meeting={meeting}
        initialTab={tab}
        canViewAllLoans={canViewAllLoans}
        currentMemberId={currentMemberId}
      />
    );
  } catch {
    notFound();
  }
}
