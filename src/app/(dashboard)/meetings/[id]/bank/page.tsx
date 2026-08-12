import { getBankTransactions } from "@/features/meetings/services/get-bank-transactions";
import BankTransactionForm from "@/features/meetings/ui/BankTransactionForm";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BankTransactionsPage({ params }: Props) {
  const { id } = await params;

  const summary = await getBankTransactions(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={summary.status} title="Bank Transactions">
      <BankTransactionForm meetingId={id} initialSummary={summary} />
    </MeetingWorkflowLayout>
  );
}
