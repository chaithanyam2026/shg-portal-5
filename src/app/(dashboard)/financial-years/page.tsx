import { Alert, Stack } from "@mui/material";

import { getFinancialYearCreateEligibility, listFinancialYears } from "@/features/financial-year/services";
import connectMongo from "@/lib/db/mongodb";

import PageHeader from "@/components/layout/PageHeader";
import FinancialYearList from "@/features/financial-year/ui/FinancialYearList";
import NewFinancialYearButton from "@/features/financial-year/ui/NewFinancialYearButton";

export const dynamic = "force-dynamic";

export default async function FinancialYearsPage() {
  try {
    await connectMongo();

    const [financialYears, createEligibility] = await Promise.all([
      listFinancialYears(),
      getFinancialYearCreateEligibility(),
    ]);

    return (
      <Stack spacing={3}>
        <PageHeader
          title="Financial Years"
          showBack={false}
          subtitle="Manage financial years for your SHG."
        >
          <NewFinancialYearButton
            allowed={createEligibility.allowed}
            reason={createEligibility.reason}
          />
        </PageHeader>

        <FinancialYearList financialYears={financialYears} />
      </Stack>
    );
  } catch (error) {
    console.error(error);

    return <Alert severity="error">Failed to load financial years.</Alert>;
  }
}
