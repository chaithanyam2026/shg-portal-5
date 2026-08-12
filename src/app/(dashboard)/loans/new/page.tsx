import { Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import { getActiveFinancialYear } from "@/features/financial-year/services/get-active";

import { listMembers } from "@/features/financial-year/services";

import NewLoanPage from "@/features/loans/ui/NewLoanPage";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export default async function Page() {
  const [financialYear, members] = await Promise.all([getActiveFinancialYear(), listMembers()]);

  if (!financialYear) {
    redirect("/financial-years");
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="New Loan" backHref="/loans" />

      <NewLoanPage financialYearId={financialYear._id.toString()} members={members} />
    </Stack>
  );
}
