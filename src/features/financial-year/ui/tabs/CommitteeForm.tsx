"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import type { FinancialYearDetails, MemberLookup } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
};

const ROLES = [
  {
    key: "president",
    label: "President",
  },
  {
    key: "vicePresident",
    label: "Vice President",
  },
  {
    key: "secretary",
    label: "Secretary",
  },
  {
    key: "jointSecretary",
    label: "Joint Secretary",
  },
  {
    key: "treasurer",
    label: "Treasurer",
  },
] as const;

type CommitteeState = {
  president: string;
  vicePresident: string;
  secretary: string;
  jointSecretary: string;
  treasurer: string;
};

export default function CommitteeForm({ financialYear, members }: Props) {
  const router = useRouter();

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const [committee, setCommittee] = useState<CommitteeState>({
    president: financialYear.executiveCommittee?.president?._id ?? "",

    vicePresident: financialYear.executiveCommittee?.vicePresident?._id ?? "",

    secretary: financialYear.executiveCommittee?.secretary?._id ?? "",

    jointSecretary: financialYear.executiveCommittee?.jointSecretary?._id ?? "",

    treasurer: financialYear.executiveCommittee?.treasurer?._id ?? "",
  });

  function handleChange(role: keyof CommitteeState, value: string) {
    setCommittee((previous) => ({
      ...previous,
      [role]: value,
    }));
  }

  async function save() {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/financial-years/${financialYear._id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          executiveCommittee: {
            president: committee.president || null,

            vicePresident: committee.vicePresident || null,

            secretary: committee.secretary || null,

            jointSecretary: committee.jointSecretary || null,

            treasurer: committee.treasurer || null,
          },
          members: financialYear.members.map((member) => ({
            memberId: member.memberId._id,

            openingContribution: member.opening.contribution ?? 0,

            openingLoan: member.openingLoan ?? 0,

            openingSpecialLoan: member.openingSpecialLoan ?? 0,

            specialLoanExpiry: member.specialLoanExpiry ?? null,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Failed to save committee.");
      }

      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to save executive committee.");
      }
    } finally {
      setSaving(false);
    }
  }
  console.log("financialYear.members", financialYear.members);
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">Executive Committee</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {ROLES.map((role) => (
            <FormControl fullWidth key={role.key}>
              <InputLabel>{role.label}</InputLabel>

              <Select
                value={committee[role.key]}
                label={role.label}
                onChange={(event) => handleChange(role.key, event.target.value)}
              >
                <MenuItem value="">None</MenuItem>

                {financialYear.members.map(({ memberId }) => (
                  <MenuItem key={memberId._id} value={memberId._id}>
                    {memberId.memberCode} - {memberId.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            Save Committee
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
