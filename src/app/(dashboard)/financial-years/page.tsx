import Link from "next/link";

import { Alert, Button, Stack } from "@mui/material";

import { listFinancialYears } from "@/features/financial-year/services";
import connectMongo from "@/lib/db/mongodb";

import PageHeader from "@/components/layout/PageHeader";
import FinancialYearList from "@/features/financial-year/ui/FinancialYearList";

export const dynamic = "force-dynamic";

export default async function FinancialYearsPage() {
  try {
    await connectMongo();

    const financialYears = await listFinancialYears();

    return (
      <Stack spacing={3}>
        <PageHeader
          title="Financial Years"
          showBack={false}
          subtitle="Manage financial years for your SHG."
        >
          <Link href="/financial-years/new" style={{ textDecoration: "none" }}>
            <Button variant="contained">New</Button>
          </Link>
        </PageHeader>

        <FinancialYearList financialYears={financialYears} />
      </Stack>
    );
  } catch (error) {
    console.error(error);

    return <Alert severity="error">Failed to load financial years.</Alert>;
  }
}
