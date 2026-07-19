import { Container, Stack, Typography } from "@mui/material";

import { getSummary } from "@/features/meetings/services/get-summary";

import MeetingTabs from "@/features/meetings/ui/MeetingTabs";
import SummaryView from "@/features/meetings/ui/SummaryView";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;

  const summary = await getSummary(id);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h4">Meeting Summary</Typography>

        <MeetingTabs meetingId={id} status={summary.status} />

        <SummaryView meetingId={id} summary={summary} />
      </Stack>
    </Container>
  );
}
