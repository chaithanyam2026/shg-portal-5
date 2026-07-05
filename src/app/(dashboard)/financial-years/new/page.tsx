import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import FinancialYearForm from "@/features/financial-year/ui/FinancialYearForm";

export const metadata = {
  title: "Create Financial Year",
};

export default function NewFinancialYearPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 2,
      }}
    >
      <Stack spacing={3}>
        <Link
href="/financial-years"
  style={{ textDecoration: "none" }}
>
        <Button
         
          
          startIcon={<ArrowBackIcon />}
          sx={{
            alignSelf: "flex-start",
          }}
        >
          Back
        </Button>
        </Link>

        <Stack spacing={1}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight={700}
          >
            Create Financial Year
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Create a new financial year for your SHG.
          </Typography>
        </Stack>

        <FinancialYearForm />
      </Stack>
    </Container>
  );
}