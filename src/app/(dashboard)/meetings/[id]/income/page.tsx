import { Container, Stack, Typography } from "@mui/material";

import { getIncome } from "@/features/meetings/services/get-income";
import IncomeForm from "@/features/meetings/ui/IncomeForm";
import MeetingTabs from "@/features/meetings/ui/MeetingTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IncomePage({ params }: Props) {
  const { id } = await params;

  const summary = await getIncome(id);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h4">Other Income</Typography>

        <MeetingTabs meetingId={id} status={summary.status} />

        <IncomeForm meetingId={id} initialSummary={summary} />
      </Stack>
    </Container>
  );
}
