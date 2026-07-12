import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import Link from "next/link";

import {
  listFinancialYears,
} from "@/features/financial-year/services";

import {
  listLoans,
} from "@/features/loans/services";

import LoanList from "@/features/loans/ui/LoanList";

export default async function Page() {
  try {
    const [
      loans,
      financialYears,
    ] = await Promise.all([
      listLoans(),
      listFinancialYears(),
    ]);

    if (loans.length === 0) {
      return (
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 8,
          }}
        >
          <Stack
            spacing={3}
            alignItems="center"
            textAlign="center"
          >
            <Typography variant="h4">
              Loans
            </Typography>

            <Alert severity="info">
              No loans have been
              created yet.
            </Alert>

<Link  href="/loans/new">
            <Button
             
             
              variant="contained"
            >
              Create Loan
            </Button>
            </Link>
          </Stack>
        </Box>
      );
    }

    return (
      <LoanList
        loans={loans}
        financialYears={
          financialYears
        }
      />
    );
  } catch (error) {
    console.error(error);

    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 8,
        }}
      >
        <Alert severity="error">
          Unable to load loans.
          Please try again later.
        </Alert>
      </Box>
    );
  }
}