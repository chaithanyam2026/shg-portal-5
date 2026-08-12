import { Stack, Typography } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

import { listClosedFinancialYears } from "@/features/financial-year/services/list-closed";

import CreateFinancialYearWizard from "@/features/financial-year/ui/CreateFinancialYearWizard";
import { listFinancialYears } from "@/features/financial-year/services";

export const metadata = {
  title: "Create Next Financial Year",
};

export default async function NewFinancialYearPage() {
  const allFinancialYears = await listFinancialYears();
  const closedFinancialYears = await listClosedFinancialYears();

  const isFirstFinancialYear = allFinancialYears.length === 0;

  return (
    <Stack spacing={3}>
      <PageHeader title="Create Next Financial Year" backHref="/financial-years" />

      <Typography variant="body2" color="text.secondary">
        Create the next financial year by selecting a previously closed financial year. Opening
        balances and member balances will be carried forward automatically.
      </Typography>

      <CreateFinancialYearWizard
        financialYears={closedFinancialYears}
        isFirstFinancialYear={isFirstFinancialYear}
      />
    </Stack>
  );
}
