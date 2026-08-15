import { notFound } from "next/navigation";

import { getMeeting } from "@/features/meetings/services/get";
import MeetingWorkspace from "@/features/meetings/ui/MeetingWorkspace";

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
    const meeting = await getMeeting(id);

    return <MeetingWorkspace meeting={meeting} initialTab={tab} />;
  } catch {
    notFound();
  }
}
