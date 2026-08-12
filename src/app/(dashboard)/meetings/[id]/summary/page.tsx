import { getSummary } from "@/features/meetings/services/get-summary";

import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";
import SummaryView from "@/features/meetings/ui/SummaryView";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;

  const summary = await getSummary(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={summary.status} title="Meeting Summary">
      <SummaryView meetingId={id} summary={summary} />
    </MeetingWorkflowLayout>
  );
}
