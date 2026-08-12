"use client";

import { Chip, Stack, Tooltip, Typography } from "@mui/material";

import type { AttendanceRegisterCell } from "../domain";

type Props = {
  cell: AttendanceRegisterCell;
};

function getLabel(cell: AttendanceRegisterCell) {
  switch (cell.status) {
    case "PRESENT":
      return "✓";

    case "LEAVE":
      return "L";

    case "ABSENT":
      return `A(${cell.fineCharged})`;
  }
}

function getColor(cell: AttendanceRegisterCell) {
  switch (cell.status) {
    case "PRESENT":
      return "success";

    case "LEAVE":
      return "warning";

    case "ABSENT":
      return "error";
  }
}

export default function AttendanceStatusChip({ cell }: Props) {
  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {cell.meetingDate.toLocaleDateString("en-IN")}
          </Typography>

          <Typography variant="body2">Status : {cell.status}</Typography>

          {cell.status === "ABSENT" && (
            <>
              <Typography variant="body2">
                Consecutive Absence : {cell.consecutiveAbsence}
              </Typography>

              <Typography variant="body2">Fine Charged : ₹{cell.fineCharged}</Typography>

              <Typography variant="body2">Fine Paid : ₹{cell.finePaid}</Typography>

              <Typography variant="body2">Pending Fine : ₹{cell.pendingFine}</Typography>
            </>
          )}
        </Stack>
      }
    >
      <Chip label={getLabel(cell)} color={getColor(cell)} size="small" variant="filled" />
    </Tooltip>
  );
}
