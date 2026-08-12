"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import type { MemberContributionPayments } from "../../domain/member-contribution-payments";
import type { MemberDetails } from "../../types";

import ContributionsTab from "./ContributionsTab";

type Props = {
  financialYearId: string;

  member: MemberDetails;
};

export default function ContributionsTabLoader({ member, financialYearId }: Props) {
  const [contributions, setContributions] = useState<MemberContributionPayments | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!financialYearId) {
        setContributions(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          financialYearId,
        });

        const response = await fetch(
          `/api/members/${member._id}/contributions?${params.toString()}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to load contribution payments.");
        }

        setContributions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load contribution payments.");
        setContributions(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [member._id, financialYearId]);

  if (!financialYearId) {
    return <Alert severity="info">Select a financial year to view contribution payments.</Alert>;
  }

  if (loading) {
    return (
      <Stack
        sx={{
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!contributions) {
    return <Alert severity="info">Contribution payment information is not available.</Alert>;
  }

  return <ContributionsTab contributions={contributions} />;
}
