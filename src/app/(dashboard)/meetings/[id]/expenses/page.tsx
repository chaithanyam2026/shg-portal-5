import {
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { getExpenses } from "@/features/meetings/services/get-expenses";

import MeetingTabs from "@/features/meetings/ui/MeetingTabs";
import ExpenseForm from "@/features/meetings/ui/ExpenseForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExpensesPage({
  params,
}: Props) {
  const { id } = await params;

  const summary =
    await getExpenses(id);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h4">
          Expenses
        </Typography>

        <MeetingTabs
          meetingId={id}
          status={summary.status}
        />

        <ExpenseForm
          meetingId={id}
          initialSummary={summary}
        />
      </Stack>
    </Container>
  );
}