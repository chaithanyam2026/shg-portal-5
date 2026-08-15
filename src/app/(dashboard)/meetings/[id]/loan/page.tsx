import { getMeetingLoans } from "@/features/meetings/services/get-meeting-loans";

import MeetingLoanForm from "@/features/meetings/ui/MeetingLoanForm";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MeetingLoansPage({ params }: Props) {
  const { id } = await params;

  const summary = await getMeetingLoans(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={summary.status} title="Loans">
      <MeetingLoanForm initialSummary={summary} />
    </MeetingWorkflowLayout>
  );
}
