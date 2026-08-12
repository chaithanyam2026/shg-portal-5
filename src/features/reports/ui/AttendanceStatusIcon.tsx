"use client";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { Stack, Tooltip, Typography } from "@mui/material";

import type { AttendanceRegisterCell } from "../domain";

type Props = {
  cell: AttendanceRegisterCell;
};

function formatDate(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AttendanceStatusIcon({ cell }: Props) {
  const iconProps = {
    fontSize: "small" as const,
  };

  let icon = <CheckCircleIcon color="success" {...iconProps} />;
  let statusLabel = "Present";

  if (cell.status === "ABSENT") {
    icon = <CancelOutlinedIcon color="error" {...iconProps} />;
    statusLabel = "Absent";
  }

  if (cell.status === "LEAVE") {
    icon = <EventBusyOutlinedIcon color="warning" {...iconProps} />;
    statusLabel = "Leave";
  }

  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatDate(cell.meetingDate)}
          </Typography>

          <Typography variant="body2">Status: {statusLabel}</Typography>

          {cell.status === "ABSENT" && (
            <>
              <Typography variant="body2">
                Consecutive absence: {cell.consecutiveAbsence}
              </Typography>

              <Typography variant="body2">Fine charged: ₹{cell.fineCharged}</Typography>

              <Typography variant="body2">Fine paid: ₹{cell.finePaid}</Typography>

              <Typography variant="body2">Pending fine: ₹{cell.pendingFine}</Typography>
            </>
          )}
        </Stack>
      }
    >
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          minWidth: 28,
        }}
      >
        {icon}
      </Stack>
    </Tooltip>
  );
}
