import Link from "next/link";
import { notFound } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

import { get } from "@/features/financial-year/services/get";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
// import type { FinancialYearStatus } from "@/models/FinancialYear";
import type { FinancialYearStatus } from "@/features/financial-year/types";
import FinancialYearTabs from "@/features/financial-year/ui/FinancialYearTabs";
import { list as listMembers } from "@/features/member/services/list";

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
    const members = await listMembers();

    return (
      <Container
        maxWidth="md"
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

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <Typography
                variant="h5"
                component="h1"
                fontWeight={700}
              >
                {financialYear.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Financial Year Details
              </Typography>
            </Box>

            <Chip
              label={financialYear.status}
              color={getStatusColor(financialYear.status)}
            />
          </Stack>

          {/* <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Start Date
                  </Typography>

                  <Typography variant="body1">
                    {format(
                      new Date(financialYear.startDate),
                      "dd MMM yyyy",
                    )}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    End Date
                  </Typography>

                  <Typography variant="body1">
                    {format(
                      new Date(financialYear.endDate),
                      "dd MMM yyyy",
                    )}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Remarks
                  </Typography>

                  <Typography variant="body1">
                    {financialYear.remarks ||
                      "No remarks"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card> */}
          <FinancialYearTabs
            financialYear={financialYear}
            members={members}
          />
          <pre>{JSON.stringify(financialYear, null, 2)}</pre>
        </Stack>
      </Container>
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