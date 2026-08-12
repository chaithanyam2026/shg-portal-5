import { getIncome } from "@/features/meetings/services/get-income";
import IncomeForm from "@/features/meetings/ui/IncomeForm";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IncomePage({ params }: Props) {
  const { id } = await params;

  const summary = await getIncome(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={summary.status} title="Other Income">
      <IncomeForm meetingId={id} initialSummary={summary} />
    </MeetingWorkflowLayout>
  );
}
