import Link from "next/link";

import { format } from "date-fns";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";


import type { FinancialYearStatus } from "../types";

type FinancialYearCardProps = {
    financialYear: {
        _id: string;
        name: string;
        status: FinancialYearStatus;
        startDate: Date;
        endDate: Date;
    };
};

function getStatusColor(
  status: FinancialYearSummary["status"],
):
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error" {
  switch (status) {
    case "IN_PROGRESS":
      return "success";

    case "APPROVED":
      return "primary";

    case "VALIDATED":
      return "warning";

    case "CLOSED":
      return "default";

    case "DRAFT":
    default:
      return "default";
  }
}

export default function FinancialYearCard({
    financialYear,
}: FinancialYearCardProps) {
    return (
        <Card variant="outlined">
            <Link
                href={`/financial-years/${financialYear._id}`}
                style={{ textDecoration: "none" }}
            >
                <CardActionArea


                >
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Typography
                                    variant="h6"
                                    component="h2"
                                >
                                    {financialYear.name}
                                </Typography>

                                <Chip
                                    size="small"
                                    label={financialYear.status}
                                    color={getStatusColor(
                                        financialYear.status,
                                    )}
                                />
                            </Stack>

                            <Stack spacing={0.5}>
                                <Typography
                                    variant="body2"
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
                            </Stack>

                            <Stack spacing={0.5}>
                                <Typography
                                    variant="body2"
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
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                            >
                                <ChevronRightIcon
                                    color="action"
                                    fontSize="small"
                                />
                            </Stack>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
}