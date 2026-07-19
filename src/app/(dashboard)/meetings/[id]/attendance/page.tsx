import { Container, Stack, Typography } from "@mui/material";

import { getAttendance } from "@/features/meetings/services/get-attendance";
import AttendanceForm from "@/features/meetings/ui/AttendanceForm";
import MeetingTabs from "@/features/meetings/ui/MeetingTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AttendancePage({ params }: Props) {
  const { id } = await params;

  const attendance = await getAttendance(id);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Attendance</Typography>
        <MeetingTabs meetingId={id} status={attendance.status} />

        <AttendanceForm meetingId={id} initialRecords={attendance.records} />
      </Stack>
    </Container>
  );
}
