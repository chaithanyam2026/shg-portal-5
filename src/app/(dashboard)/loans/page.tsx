import { Alert, Box } from "@mui/material";

import { listFinancialYears } from "@/features/financial-year/services";

import { listLoans } from "@/features/loans/services";

import PageHeader from "@/components/layout/PageHeader";
import LoanList from "@/features/loans/ui/LoanList";

export default async function Page() {
  try {
    const [loans, financialYears] = await Promise.all([listLoans(), listFinancialYears()]);

    return (
      <>
        <PageHeader title="Loans" showBack={false} />

        <Box sx={{ mt: 3 }}>
          <LoanList loans={loans} financialYears={financialYears} />
        </Box>
      </>
    );
  } catch (error) {
    console.error(error);

    return <Alert severity="error">Unable to load loans. Please try again later.</Alert>;
  }
}
