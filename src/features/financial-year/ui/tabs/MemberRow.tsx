"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, MenuItem, TableCell, TableRow, TextField } from "@mui/material";

import type { MemberLookup } from "../../types";

export type MemberRowData = {
  memberId: string;
  openingContribution: number;
  openingLoan: number;
  openingSpecialLoan: number;
  openingSpecialLoanExpiry: string;
};

type Props = {
  row: MemberRowData;

  members: MemberLookup[];

  selectedMemberIds: string[];

  disabled?: boolean;

  onChange: (changes: Partial<MemberRowData>) => void;

  onRemove: () => void;
};

export default function MemberRow({
  row,
  members,
  selectedMemberIds,
  disabled = false,
  onChange,
  onRemove,
}: Props) {
  console.log('members==', row)
  return (
    <TableRow hover>
      <TableCell sx={{ minWidth: 240 }}>
        <TextField
          select
          fullWidth
          size="small"
          value={row.memberId}
          disabled={disabled}
          onChange={(event) =>
            onChange({
              memberId: event.target.value,
            })
          }
        >
          <MenuItem value="">Select Member</MenuItem>

          {members.map((member) => {
            const alreadySelected =
              selectedMemberIds.includes(member._id) && member._id !== row.memberId;

            return (
              <MenuItem key={member._id} value={member._id} disabled={alreadySelected}>
                {member.memberCode} - {member.name}
              </MenuItem>
            );
          })}
        </TextField>
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={row.openingContribution}
          disabled={disabled}
          slotProps={{
            htmlInput: {
              min: 0,
              step: 1,
            },
          }}
          onChange={(event) =>
            onChange({
              openingContribution: Number(event.target.value),
            })
          }
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={row.openingLoan}
          disabled={disabled}
          slotProps={{
            htmlInput: {
              min: 0,
              step: 1,
            },
          }}
          onChange={(event) =>
            onChange({
              openingLoan: Number(event.target.value),
            })
          }
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={row.openingSpecialLoan}
          disabled={disabled}
          slotProps={{
            htmlInput: {
              min: 0,
              step: 1,
            },
          }}
          onChange={(event) => {
            const value = Number(event.target.value);

            onChange({
              openingSpecialLoan: value,
              openingSpecialLoanExpiry: value > 0 ? row.openingSpecialLoanExpiry : "",
            });
          }}
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={row.openingSpecialLoanExpiry ?? ""}
          disabled={disabled || row.openingSpecialLoan <= 0}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          onChange={(event) =>
            onChange({
              openingSpecialLoanExpiry: event.target.value,
            })
          }
        />
      </TableCell>

      <TableCell align="center">
        <IconButton color="error" disabled={disabled} onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
