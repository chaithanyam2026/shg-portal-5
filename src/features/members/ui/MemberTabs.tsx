"use client";

import { useState } from "react";

import Link from "next/link";

import { Alert, Box, Button, Snackbar, Stack, Tab, Tabs } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";
import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import { canViewAllLoansForFinancialYear, canViewLoanDetails } from "@/features/loans/domain";

import type { MemberDetails } from "../types";

import AttendanceFineTab from "./tabs/AttendanceFineTab";
import ContributionsTabLoader from "./tabs/ContributionsTabLoader";
import GeneralTab from "./tabs/GeneralTab";
import LoansTab from "./tabs/LoansTab";
import MemberDeactivateButton from "./MemberDeactivateButton";
import MemberResetPasswordDialog from "./MemberResetPasswordDialog";

type Props = {
  financialYearOptions: FinancialYearOption[];

  initialFinancialYearId: string;

  member: MemberDetails;

  canViewAllFinancialYears?: boolean;

  officeBearerFinancialYearIds?: readonly string[];

  currentMemberId?: string | null;

  canManageMembers?: boolean;

  canResetPassword?: boolean;
};

const FINANCIAL_YEAR_TABS = new Set([1, 2, 3]);

export default function MemberTabs({
  member,
  financialYearOptions,
  initialFinancialYearId,
  canViewAllFinancialYears = false,
  officeBearerFinancialYearIds = [],
  currentMemberId = null,
  canManageMembers = false,
  canResetPassword = false,
}: Props) {
  const [tab, setTab] = useState(0);

  const [financialYearId, setFinancialYearId] = useState(initialFinancialYearId);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const showFinancialYearSelector = FINANCIAL_YEAR_TABS.has(tab);

  return (
    <Stack spacing={3}>
      <PageHeader title={member.name} subtitle={member.memberCode} backHref="/members">
        {canResetPassword && (
          <Button variant="outlined" onClick={() => setResetOpen(true)}>
            Reset Password
          </Button>
        )}

        {canManageMembers && (
          <>
            <MemberDeactivateButton member={member} />

            <Button component={Link} href="/members/new" variant="contained">
              New Member
            </Button>
          </>
        )}
      </PageHeader>

      <Box>
        <Tabs
          value={tab}
          onChange={(_event, value: number) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />

          <Tab label="Loans" />

          <Tab label="Passbook" />

          <Tab label="Attendance Fine" />
        </Tabs>

        {showFinancialYearSelector && (
          <Box sx={{ mt: 2 }}>
            {financialYearOptions.length === 0 ? (
              <Box component="p" sx={{ color: "text.secondary", m: 0 }}>
                This member is not enrolled in any financial year.
              </Box>
            ) : (
              <FinancialYearSelector
                value={financialYearId}
                options={financialYearOptions}
                onChange={setFinancialYearId}
              />
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <GeneralTab member={member} />}

          {tab === 1 && (
            <LoansTab
              member={member}
              financialYearId={financialYearId}
              canViewLoanDetails={canViewLoanDetails({
                loanMemberId: member._id,
                currentMemberId,
                canViewAllLoans: canViewAllLoansForFinancialYear({
                  financialYearId,
                  canViewAllFinancialYears,
                  officeBearerFinancialYearIds,
                }),
              })}
            />
          )}

          {tab === 2 && (
            <ContributionsTabLoader member={member} financialYearId={financialYearId} />
          )}

          {tab === 3 && (
            <AttendanceFineTab member={member} financialYearId={financialYearId} />
          )}
        </Box>
      </Box>

      {canResetPassword && (
        <MemberResetPasswordDialog
          member={resetOpen ? member : null}
          onClose={() => setResetOpen(false)}
          onSuccess={() => {
            setResetOpen(false);
            setResetMessage("Password reset.");
          }}
        />
      )}

      <Snackbar
        open={resetMessage !== null}
        autoHideDuration={4000}
        onClose={() => setResetMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setResetMessage(null)}>
          {resetMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
