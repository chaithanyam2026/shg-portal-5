"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoanSummaryResult } from "../types";

import { Box, Button, Tab, Tabs } from "@mui/material";

import type { LoanDetails } from "../types";

import PageHeader from "@/components/layout/PageHeader";
import type { LoanPassbook } from "../domain/loan-passbook";
import CloseLoanDialog from "./CloseLoanDialog";
import GeneralTab from "./tabs/GeneralTab";
import PassbookTab from "./tabs/PassbookTab";
import SummaryTab from "./tabs/SummaryTab";

type Props = {
  loan: LoanDetails;
  summary: LoanSummaryResult;
  passbook: LoanPassbook;
};

export default function LoanTabs({ loan, summary, passbook }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [reopening, setReopening] = useState(false);

  async function reopenLoan() {
    const ok = window.confirm("Reopen this loan so members can update it?");

    if (!ok) {
      return;
    }

    try {
      setReopening(true);

      const response = await fetch(`/api/loans/${loan._id}/reopen`, {
        method: "POST",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to reopen loan.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to reopen loan.");
    } finally {
      setReopening(false);
    }
  }

  return (
    <Box>
      <PageHeader
        title={loan.loanNumber}
        subtitle={`${loan.memberName} · ${loan.loanType}`}
        backHref="/loans"
      >
        {loan.canBeClosed && (
          <Button variant="contained" color="warning" onClick={() => setCloseDialogOpen(true)}>
            Close Loan
          </Button>
        )}

        {loan.canReopen && (
          <Button variant="outlined" color="warning" onClick={reopenLoan} disabled={reopening}>
            {reopening ? "Reopening..." : "Reopen Loan"}
          </Button>
        )}
      </PageHeader>

      <Tabs value={tab} onChange={(_event, value: number) => setTab(value)} variant="fullWidth">
        <Tab label="General" />

        <Tab label="Summary" />

        <Tab label="Passbook" />
      </Tabs>

      <Box
        sx={{
          mt: 3,
        }}
      >
        {tab === 0 && <GeneralTab loan={loan} />}

        {tab === 1 && <SummaryTab loan={loan} summary={summary} />}

        {tab === 2 && <PassbookTab passbook={passbook} />}
      </Box>

      <CloseLoanDialog
        loan={closeDialogOpen ? loan : null}
        onClose={() => setCloseDialogOpen(false)}
        onSuccess={() => {
          setCloseDialogOpen(false);
          router.refresh();
        }}
      />
    </Box>
  );
}
