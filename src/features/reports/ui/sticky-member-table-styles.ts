import type { SxProps, Theme } from "@mui/material";

export const STICKY_MEMBER_SERIAL_WIDTH = 56;

export const STICKY_MEMBER_NAME_LEFT = STICKY_MEMBER_SERIAL_WIDTH;

export const STICKY_MEMBER_NAME_WIDTH = 160;

function memberColumnShadow(theme: Theme) {
  return `4px 0 4px -4px ${theme.palette.divider}`;
}

export function stickyMemberSerialCellSx(isHeader = false): SxProps<Theme> {
  return {
    position: "sticky",
    left: 0,
    zIndex: isHeader ? 3 : 1,
    bgcolor: "background.paper",
    minWidth: STICKY_MEMBER_SERIAL_WIDTH,
    width: STICKY_MEMBER_SERIAL_WIDTH,
  };
}

export function stickyMemberNameCellSx(isHeader = false): SxProps<Theme> {
  return {
    position: "sticky",
    left: STICKY_MEMBER_NAME_LEFT,
    zIndex: isHeader ? 3 : 1,
    bgcolor: "background.paper",
    minWidth: STICKY_MEMBER_NAME_WIDTH,
    boxShadow: memberColumnShadow,
  };
}

export function stickyMemberTotalsCellSx(): SxProps<Theme> {
  return {
    position: "sticky",
    left: 0,
    zIndex: 1,
    bgcolor: "background.paper",
    minWidth: STICKY_MEMBER_SERIAL_WIDTH + STICKY_MEMBER_NAME_WIDTH,
    boxShadow: memberColumnShadow,
  };
}
