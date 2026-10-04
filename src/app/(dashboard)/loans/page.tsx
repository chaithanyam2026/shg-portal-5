import { Alert, Box } from "@mui/material";

import { FINANCIAL_YEAR_STATUS } from "@/features/financial-year/domain/financial-year-status";
import { listFinancialYears } from "@/features/financial-year/services";

import { canCurrentUserViewAllLoans, listLoans } from "@/features/loans/services";

import PageHeader from "@/components/layout/PageHeader";
import LoanList from "@/features/loans/ui/LoanList";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const [financialYears, canViewAllLoans] = await Promise.all([
      listFinancialYears(),
      canCurrentUserViewAllLoans(),
    ]);

    const defaultFinancialYear =
      financialYears.find((year) => year.status === FINANCIAL_YEAR_STATUS.IN_PROGRESS) ??
      financialYears[0];
    const initialFinancialYearId = defaultFinancialYear?._id ?? "";

    const loans = await listLoans(
      initialFinancialYearId ? { financialYearId: initialFinancialYearId } : {},
    );

    return (
      <>
        <PageHeader title="Loans" showBack={false} />

        <Box sx={{ mt: 3 }}>
          <LoanList
            loans={loans}
            financialYears={financialYears}
            ownLoansOnly={!canViewAllLoans}
            initialFinancialYearId={initialFinancialYearId}
          />
        </Box>
      </>
    );
  } catch (error) {
    console.error(error);

    return <Alert severity="error">Unable to load loans. Please try again later.</Alert>;
  }
}
