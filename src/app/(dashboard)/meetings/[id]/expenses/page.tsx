import { getExpenses } from "@/features/meetings/services/get-expenses";

import ExpenseForm from "@/features/meetings/ui/ExpenseForm";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExpensesPage({ params }: Props) {
  const { id } = await params;

  const summary = await getExpenses(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={summary.status} title="Expenses">
      <ExpenseForm meetingId={id} initialSummary={summary} />
    </MeetingWorkflowLayout>
  );
}
