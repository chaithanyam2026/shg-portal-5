import { Stack, Typography } from "@mui/material";

import FinancialYearCard from "./FinancialYearCard";

type FinancialYear = {
  _id: string;
  name: string;
  status: "DRAFT" | "IN_PROGRESS" | "VALIDATED" | "APPROVED" | "CLOSED";
  startDate: Date;
  endDate: Date;
};

type FinancialYearListProps = {
  financialYears: FinancialYear[];
};

export default function FinancialYearList({
  financialYears,
}: FinancialYearListProps) {
  if (financialYears.length === 0) {
    return (
      <Typography
        color="text.secondary"
        align="center"
        sx={{ py: 6 }}
      >
        No financial years found.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {financialYears.map((financialYear) => (
        <FinancialYearCard
          key={financialYear._id}
          financialYear={financialYear}
        />
      ))}
    </Stack>
  );
}