import { Alert, Stack, Typography } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

import { getFinancialYearCreateEligibility } from "@/features/financial-year/services/get-create-eligibility";
import { listOpeningBalanceSourceFinancialYears } from "@/features/financial-year/services/list-opening-balance-sources";

import CreateFinancialYearWizard from "@/features/financial-year/ui/CreateFinancialYearWizard";
import { listFinancialYears } from "@/features/financial-year/services";

export const metadata = {
  title: "Create Next Financial Year",
};

export default async function NewFinancialYearPage() {
  const [allFinancialYears, closedFinancialYears, createEligibility] = await Promise.all([
    listFinancialYears(),
    listOpeningBalanceSourceFinancialYears(),
    getFinancialYearCreateEligibility(),
  ]);

  const isFirstFinancialYear = allFinancialYears.length === 0;

  return (
    <Stack spacing={3}>
      <PageHeader title="Create Next Financial Year" backHref="/financial-years" />

      {!createEligibility.allowed ? (
        <Alert severity="warning">{createEligibility.reason}</Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">
            Create the next financial year by selecting a closed, validated, or approved financial
            year. Opening balances and member balances will be carried forward automatically.
          </Typography>

          <CreateFinancialYearWizard
            financialYears={closedFinancialYears}
            isFirstFinancialYear={isFirstFinancialYear}
          />
        </>
      )}
    </Stack>
  );
}
