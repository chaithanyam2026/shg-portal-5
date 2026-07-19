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

const statusOrder = {
  IN_PROGRESS: 0,
  DRAFT: 1,
  VALIDATED: 2,
  APPROVED: 3,
  CLOSED: 4,
};

export default function FinancialYearList({ financialYears }: FinancialYearListProps) {
  if (financialYears.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
        No financial years found.
      </Typography>
    );
  }

  const sortedFinancialYears = [...financialYears].sort((a, b) => {
    const statusComparison = statusOrder[a.status] - statusOrder[b.status];

    if (statusComparison !== 0) {
      return statusComparison;
    }

    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <Stack spacing={2}>
      {sortedFinancialYears.map((financialYear) => (
        <FinancialYearCard key={financialYear._id} financialYear={financialYear} />
      ))}
    </Stack>
  );
}
