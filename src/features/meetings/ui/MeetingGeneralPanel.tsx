import {
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type { MeetingDetails } from "../types";

import { formatDate } from "@/lib/utils/date";

import MeetingStatusChip from "./MeetingStatusChip";

type Props = {
  meeting: MeetingDetails;
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default function MeetingGeneralPanel({ meeting }: Props) {
  return (
    <>
      {meeting.status === "CLOSED" && !meeting.canEdit && (
        <Alert severity="info">This meeting is closed and cannot be edited.</Alert>
      )}

      {meeting.status === "CLOSED" && meeting.canReopen && (
        <Alert severity="warning">
          This meeting is closed. Reopen it so members can edit it, or update it yourself as an
          administrator.
          {meeting.financialYearStatus === "CLOSED"
            ? " If the financial year is also closed, reopen that year first so members are not blocked."
            : ""}
        </Alert>
      )}

      {meeting.status === "CLOSED" && meeting.canEdit && !meeting.canReopen && (
        <Alert severity="warning">
          This meeting is closed. You can still update it because you are an administrator.
        </Alert>
      )}

      {meeting.status !== "CLOSED" && meeting.financialYearStatus === "CLOSED" && !meeting.canEdit && (
        <Alert severity="info">This financial year is closed and cannot be edited.</Alert>
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
              <Typography sx={{ fontWeight: 600 }}>Status</Typography>

              <MeetingStatusChip status={meeting.status} />
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Meeting Date
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(meeting.meetingDate)}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Place
              </Typography>

              <Typography>{meeting.place || "-"}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Agenda
              </Typography>

              <Typography sx={{ whiteSpace: "pre-wrap" }}>{meeting.agenda || "-"}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Remarks
              </Typography>

              <Typography sx={{ whiteSpace: "pre-wrap" }}>{meeting.remarks || "-"}</Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Started At
              </Typography>

              <Typography>{formatDateTime(meeting.startedAt)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Approved At
              </Typography>

              <Typography>{formatDateTime(meeting.approvedAt)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Closed At
              </Typography>

              <Typography>{formatDateTime(meeting.closedAt)}</Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Created
              </Typography>

              <Typography>{formatDateTime(meeting.createdAt)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>

              <Typography>{formatDateTime(meeting.updatedAt)}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
