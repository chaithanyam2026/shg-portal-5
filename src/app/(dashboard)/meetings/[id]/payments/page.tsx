import { Container, Stack, Typography } from "@mui/material";

import { getPayments } from "@/features/meetings/services/get-payments";
import MeetingTabs from "@/features/meetings/ui/MeetingTabs";
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
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h4">Member Payments</Typography>

        <MeetingTabs meetingId={id} status={payments.status} />

        <PaymentForm meetingId={id} initialRecords={payments.records} />
      </Stack>
    </Container>
  );
}
