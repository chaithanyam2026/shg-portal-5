import { Alert, Box } from "@mui/material";

import { listFinancialYears } from "@/features/financial-year/services";

import { canCurrentUserViewAllLoans, listLoans } from "@/features/loans/services";

import PageHeader from "@/components/layout/PageHeader";
import LoanList from "@/features/loans/ui/LoanList";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const [loans, financialYears, canViewAllLoans] = await Promise.all([
      listLoans(),
      listFinancialYears(),
      canCurrentUserViewAllLoans(),
    ]);

    return (
      <>
        <PageHeader title="Loans" showBack={false} />

        <Box sx={{ mt: 3 }}>
          <LoanList loans={loans} financialYears={financialYears} ownLoansOnly={!canViewAllLoans} />
        </Box>
      </>
    );
  } catch (error) {
    console.error(error);

    return <Alert severity="error">Unable to load loans. Please try again later.</Alert>;
  }
}
