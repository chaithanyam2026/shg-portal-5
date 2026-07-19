"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardContent, Stack } from "@mui/material";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { FinancialYearDetails, MemberLookup } from "../../types";

import AddIcon from "@mui/icons-material/Add";

import MemberRow from "./MemberRow";

type Member = {
  _id: string;
  memberCode: string;
  name: string;
};

type MemberRow = {
  memberId: string;
  openingContribution?: number;
  openingLoan?: number;
  openingSpecialLoan?: number;
  specialLoanExpiry?: string;
};

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
};

export default function MembersForm({ financialYear, members }: Props) {
  const router = useRouter();

  //const [members, setMembers] = useState<Member[]>([]);

  const [selected, setSelected] = useState(financialYear.members.map((m) => m._id));

  // const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [dirty, setDirty] = useState(false);
  const initialRows = useMemo(
    () =>
      (financialYear.members ?? []).map((member) => ({
        memberId: getMemberId(member),
        openingContribution: member.opening.contribution ?? 0,
        openingLoan: member.opening.loan ?? 0,
        openingSpecialLoan: member.opening.specialLoan ?? 0,
        specialLoanExpiry: member.opening.specialLoan
          ? new Date(member.opening.specialLoanExpiry).toISOString().slice(0, 10)
          : "",
      })),
    [financialYear],
  );

  const [success, setSuccess] = useState(false);

  const [rows, setRows] = useState<MemberRow[]>(
    financialYear.members.map((member) => ({
      memberId: getMemberId(member),

      openingContribution: member.opening.contribution,

      openingLoan: member.opening.loan,

      openingSpecialLoan: member.opening.specialLoan,

      specialLoanExpiry: member.opening.specialLoan
        ? new Date(member.opening.specialLoanExpiry).toISOString().slice(0, 10)
        : "",
    })),
  );

  function addMember() {
    setRows((previous) => [
      ...previous,
      {
        memberId: "",

        openingContribution: 0,

        openingLoan: 0,

        openingSpecialLoan: 0,

        specialLoanExpiry: "",
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

  function updateMember(index: number, changes: Partial<MemberRow>) {
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

  function getMemberId(member: any): string {
    if (!member?.memberId) {
      return "";
    }

    // memberId is already a string/ObjectId
    if (typeof member.memberId === "string") {
      return member.memberId;
    }

    // populated Member document
    if (member.memberId._id) {
      return member.memberId._id.toString();
    }

    // ObjectId instance
    return member.memberId.toString();
  }

  /* function resetMembers() {
    setRows(
      financialYear.members.map((member) => ({
        memberId: getMemberId(member),
  
        openingContribution:
          member.openingContribution,
  
        openingLoan:
          member.openingLoan,
  
        openingSpecialLoan:
          member.openingSpecialLoan,
  
        specialLoanExpiry:
          member.specialLoanExpiry
            ? new Date(
                member.specialLoanExpiry,
              )
                .toISOString()
                .slice(0, 10)
            : "",
      })),
    );
  } */

  function isMemberSelected(memberId: string) {
    return rows.some((row) => row.memberId === memberId);
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

      if (row.openingSpecialLoan > 0 && !row.specialLoanExpiry) {
        return `Special loan expiry is required (row ${index + 1}).`;
      }
    }

    return null;
  }
  function buildPayload() {
    console.log("\n\n\ buildPayload");
    return {
      members: rows.map((row) => ({
        memberId: row.memberId,

        openingContribution: row.openingContribution,

        openingLoan: row.openingLoan,

        openingSpecialLoan: row.openingSpecialLoan,

        specialLoanExpiry: row.specialLoanExpiry || null,
      })),
    };
  }

  /* useEffect(() => {
    async function loadMembers() {
      try {
        setLoading(true);

        const response = await fetch("/api/members");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ??
              "Unable to load members.",
          );
        }

        setMembers(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load members.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []); */

  function toggleMember(id: string) {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((x) => x !== id) : [...previous, id],
    );
  }

  async function save() {
    console.log("\n\n Save");
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/financial-years/${financialYear._id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          members: selected,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save members.");
      }

      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to save members.");
      }
    } finally {
      setSaving(false);
    }
  }

  /*  if (loading) {
     return (
       <Card variant="outlined">
         <CardContent>
           <Stack
             alignItems="center"
             py={4}
           >
             <CircularProgress />
           </Stack>
         </CardContent>
       </Card>
     );
   } */

  async function saveMembers() {
    console.log("\n\n saveMembers");
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
  {
    error && <Alert severity="error">{error}</Alert>;
  }

  {
    success && <Alert severity="success">Members updated successfully.</Alert>;
  }

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addMember}>
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
                      disabled={saving}
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
        <Button onClick={resetMembers} disabled={!dirty || saving}>
          Reset
        </Button>
        <Button variant="contained" onClick={saveMembers} disabled={saving || rows.length === 0}>
          {saving ? "Saving..." : "Save Members"}
        </Button>
      </Stack>
    </>
  );
}
