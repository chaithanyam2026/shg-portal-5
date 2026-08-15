import { getMemberTransactions } from "@/features/meetings/services/get-member-transactions";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";
import MemberTransactionsView from "@/features/meetings/ui/MemberTransactionsView";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MemberTransactionsPage({ params }: Props) {
  const { id } = await params;

  const summary = await getMemberTransactions(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={summary.status} title="Member Transactions">
      <MemberTransactionsView summary={summary} />
    </MeetingWorkflowLayout>
  );
}
