"use client";

import Chip from "@mui/material/Chip";

import type { MeetingStatus } from "../domain/meeting-status";

type Props = {
  status: MeetingStatus;
};

export default function MeetingStatusChip({ status }: Props) {
  switch (status) {
    case "DRAFT":
      return <Chip label="Draft" color="default" size="small" />;

    case "IN_PROGRESS":
      return <Chip label="In Progress" color="warning" size="small" />;

    case "APPROVED":
      return <Chip label="Approved" color="success" size="small" />;

    case "CLOSED":
      return <Chip label="Closed" color="primary" size="small" />;

    default:
      return <Chip label={status} size="small" />;
  }
}
