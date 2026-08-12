import { getAttendance } from "@/features/meetings/services/get-attendance";
import AttendanceForm from "@/features/meetings/ui/AttendanceForm";
import MeetingWorkflowLayout from "@/features/meetings/ui/MeetingWorkflowLayout";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AttendancePage({ params }: Props) {
  const { id } = await params;

  const attendance = await getAttendance(id);

  return (
    <MeetingWorkflowLayout meetingId={id} status={attendance.status} title="Attendance">
      <AttendanceForm meetingId={id} initialRecords={attendance.records} />
    </MeetingWorkflowLayout>
  );
}
