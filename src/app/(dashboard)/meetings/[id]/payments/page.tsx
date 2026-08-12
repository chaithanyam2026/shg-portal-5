import { getPayments } from "@/features/meetings/services/get-payments";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";
import PaymentForm from "@/features/meetings/ui/PaymentForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaymentsPage({ params }: Props) {
  const { id } = await params;

  const payments = await getPayments(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={payments.status} title="Member Payments">
      <PaymentForm meetingId={id} initialRecords={payments.records} />
    </MeetingWorkflowLayout>
  );
}
