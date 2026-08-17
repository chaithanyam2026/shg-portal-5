"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardContent, Stack } from "@mui/material";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { toDateInputValue } from "@/lib/utils/date";
import type { FinancialYearDetails, MemberLookup } from "../../types";

import AddIcon from "@mui/icons-material/Add";

import MemberRow, { type MemberRowData } from "./MemberRow";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
  canEdit?: boolean;
};

function formatDateInputValue(value: Date | string | null) {
  return value ? toDateInputValue(value) : "";
}

export default function MembersForm({ financialYear, members, canEdit = true }: Props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [dirty, setDirty] = useState(false);

  const initialRows = useMemo(
    () =>
      financialYear.members.map((member) => ({
        memberId: member.member._id,
        openingContribution: member.opening.contribution ?? 0,
        openingLoan: member.opening.loan ?? 0,
        openingSpecialLoan: member.opening.specialLoan ?? 0,
        openingSpecialLoanExpiry:
          member.opening.specialLoan > 0
            ? formatDateInputValue(member.opening.specialLoanExpiry)
            : "",
      })),
    [financialYear.members],
  );

  const [success, setSuccess] = useState(false);

  const [rows, setRows] = useState<MemberRowData[]>(initialRows);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  function addMember() {
    setRows((previous) => [
      ...previous,
      {
        memberId: "",

        openingContribution: 0,

        openingLoan: 0,

        openingSpecialLoan: 0,

        openingSpecialLoanExpiry: "",
      },
    ]);
  }
  function removeMember(index: number) {
    setRows((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  }
  function resetMembers() {
    setRows(initialRows);
    setDirty(false);
    setError("");
  }

  function updateMember(index: number, changes: Partial<MemberRowData>) {
    setRows((previous) =>
      previous.map((row, currentIndex) =>
        currentIndex === index
          ? {
            ...row,
            ...changes,
          }
          : row,
      ),
    );
    setDirty(true);
  }

  function validateRows(): string | null {
    const selectedMembers = new Set<string>();

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      if (!row.memberId) {
        return `Please select a member for row ${index + 1}.`;
      }

      if (selectedMembers.has(row.memberId)) {
        return `Duplicate member found in row ${index + 1}.`;
      }

      selectedMembers.add(row.memberId);

      if (row.openingContribution < 0) {
        return `Opening contribution cannot be negative (row ${index + 1}).`;
      }

      if (row.openingLoan < 0) {
        return `Opening loan cannot be negative (row ${index + 1}).`;
      }

      if (row.openingSpecialLoan < 0) {
        return `Opening special loan cannot be negative (row ${index + 1}).`;
      }

      if (row.openingSpecialLoan > 0 && !row.openingSpecialLoanExpiry) {
        return `Special loan expiry is required (row ${index + 1}).`;
      }
    }

    return null;
  }
  function buildPayload() {
    return {
      members: rows.map((row) => ({
        memberId: row.memberId,

        openingContribution: row.openingContribution,

        openingLoan: row.openingLoan,

        openingSpecialLoan: row.openingSpecialLoan,

        openingSpecialLoanExpiry: row.openingSpecialLoanExpiry || null,
      })),
    };
  }

  async function saveMembers() {
    const validationError = validateRows();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const response = await fetch(`/api/financial-years/${financialYear._id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(buildPayload()),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save members.");
      }

      setSuccess(true);

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to save members.");
      }
    } finally {
      setDirty(false);
      setSaving(false);
    }
  }

  const selectedMemberIds = rows.map((row) => row.memberId);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            {success && <Alert severity="success">Members updated successfully.</Alert>}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addMember}
              disabled={!canEdit || saving}
            >
              Add Member
            </Button>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>

                    <TableCell>Member_Contribution</TableCell>

                    <TableCell>Member_Initial_Loan</TableCell>

                    <TableCell>Member_Special_Loan</TableCell>

                    <TableCell>Expiry</TableCell>

                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => (
                    <MemberRow
                      disabled={!canEdit || saving}
                      key={index}
                      row={row}
                      members={members}
                      selectedMemberIds={selectedMemberIds}
                      onRemove={() => removeMember(index)}
                      onChange={(changes) => updateMember(index, changes)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <Button onClick={resetMembers} disabled={!canEdit || !dirty || saving}>
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={saveMembers}
          disabled={!canEdit || saving || rows.length === 0}
        >
          {saving ? "Saving..." : "Save Members"}
        </Button>
      </Stack>
    </>
  );
}
