import {
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { getBankTransactions } from "@/features/meetings/services/get-bank-transactions";
import MeetingTabs from "@/features/meetings/ui/MeetingTabs";
import BankTransactionForm from "@/features/meetings/ui/BankTransactionForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BankTransactionsPage({
  params,
}: Props) {
  const { id } = await params;

  const summary =
    await getBankTransactions(id);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h4">
          Bank Transactions
        </Typography>

        <MeetingTabs
          meetingId={id}
          status={summary.status}
        />

        <BankTransactionForm
          meetingId={id}
          initialSummary={summary}
        />
      </Stack>
    </Container>
  );
}