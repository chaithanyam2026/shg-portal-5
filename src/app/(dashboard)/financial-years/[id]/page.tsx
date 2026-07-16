import Link from "next/link";
import { notFound } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { get } from "@/features/financial-year/services/get";
import type { FinancialYearStatus } from "@/features/financial-year/types";
import FinancialYearTabs from "@/features/financial-year/ui/FinancialYearTabs";
import { list as listMembers } from "@/features/member/services/list";
import { buildIncomeExpenseReport } from "@/features/reports/services";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import PageHeader from "@/components/layout/PageHeader";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

function getStatusColor(
  status: FinancialYearStatus,
):
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error" {
  switch (status) {
    case "APPROVED":
      return "success";

    case "VALIDATED":
      return "primary";

    case "IN_PROGRESS":
      return "warning";

    case "CLOSED":
      return "default";

    case "DRAFT":
    default:
      return "default";
  }
}

export default async function FinancialYearDetailsPage({
  params,
}: PageProps) {
  try {
    await connectMongo();

    const { id } = await params;

    const financialYear = await get(id);

    const [members, report] = await Promise.all([
      listMembers(),
      buildIncomeExpenseReport(id),
    ]);
    return (
      <>
      <Container
        maxWidth="md"
        sx={{
          py: 2,
        }}
      >
        <Stack spacing={3}>
          {/* <Link
            href="/financial-years"
            style={{
              textDecoration: "none",
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Back
            </Button>
          </Link> */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <PageHeader
                title="Financial Year"
                backHref="/financial-years"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Financial Year Details
              </Typography>
            </Box>

            <Chip
              label={financialYear.status}
              color={getStatusColor(
                financialYear.status,
              )}
            />
          </Stack>

          <FinancialYearTabs
            financialYear={financialYear}
            members={members}
            report={report}
          />
        </Stack>
      </Container>
       <Link
            href={`/reports/attendance/${id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <Button
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Attendance
            </Button>
          </Link>
          </>
    );
  } catch (error) {
    if (
      error instanceof AppError &&
      error.status === 404
    ) {
      notFound();
    }

    console.error(error);

    return (
      <Container
        maxWidth="md"
        sx={{
          py: 2,
        }}
      >
        <Alert severity="error">
          Failed to load financial year.
        </Alert>
      </Container>
    );
  }
}