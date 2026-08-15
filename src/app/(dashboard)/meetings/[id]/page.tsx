import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import { getMeeting } from "@/features/meetings/services/get";
import MeetingActionButton from "@/features/meetings/ui/MeetingActionButton";
import MeetingStatusChip from "@/features/meetings/ui/MeetingStatusChip";
import MeetingTabs from "@/features/meetings/ui/MeetingTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default async function MeetingDetailsPage({ params }: Props) {
  const { id } = await params;

  let meeting;

  try {
    meeting = await getMeeting(id);
  } catch {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Meeting"
        subtitle={formatDate(meeting.meetingDate)}
        backHref="/meetings"
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Link href={`/meetings/${meeting.id}/edit`} style={{ textDecoration: "none" }}>
            <Button variant="outlined">Edit</Button>
          </Link>

          <MeetingActionButton
            meetingId={meeting.id}
            action="start"
            label="Start Meeting"
            color="success"
            disabled={meeting.status !== "DRAFT"}
          />

          <MeetingActionButton
            meetingId={meeting.id}
            action="delete"
            label="Delete Meeting"
            color="error"
            variant="outlined"
            confirm
            disabled={meeting.status !== "DRAFT"}
          />

          <MeetingActionButton
            meetingId={meeting.id}
            action="close"
            label="Close Meeting"
            color="warning"
            disabled={meeting.status !== "IN_PROGRESS"}
          />
        </Stack>
      </PageHeader>

      <MeetingTabs meetingId={meeting.id} status={meeting.status} />

      {meeting.status === "CLOSED" && (
        <Alert severity="info">This meeting is closed and cannot be edited.</Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Status
              </Typography>

              <MeetingStatusChip status={meeting.status} />
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Meeting Date
              </Typography>

              <Typography>{formatDate(meeting.meetingDate)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Place
              </Typography>

              <Typography>{meeting.place}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Agenda
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {meeting.agenda || "-"}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Remarks
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {meeting.remarks || "-"}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Started At
              </Typography>

              <Typography>{formatDate(meeting.startedAt)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Approved At
              </Typography>

              <Typography>{formatDate(meeting.approvedAt)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Closed At
              </Typography>

              <Typography>{formatDate(meeting.closedAt)}</Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Created
              </Typography>

              <Typography>{formatDate(meeting.createdAt)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>

              <Typography>{formatDate(meeting.updatedAt)}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
