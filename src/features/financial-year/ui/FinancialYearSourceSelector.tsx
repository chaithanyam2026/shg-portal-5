"use client";

import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

import type { ClosedFinancialYearLookup } from "../types";

type Props = {
  financialYears: ClosedFinancialYearLookup[];

  value: string;

  onChange: (value: string) => void;
};

export default function FinancialYearSourceSelector({ financialYears, value, onChange }: Props) {
  return (
    <Stack spacing={2}>
      {financialYears.map((financialYear) => (
        <Card
          key={financialYear._id}
          variant={value === financialYear._id ? "outlined" : undefined}
        >
          <CardActionArea onClick={() => onChange(financialYear._id)}>
            <CardContent>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{financialYear.name}</Typography>

                  <Chip color="success" label="CLOSED" />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Closed:{" "}
                  {financialYear.closedAt
                    ? new Date(financialYear.closedAt).toLocaleDateString("en-IN")
                    : "-"}
                </Typography>

                <Typography variant="body2">Members: {financialYear.memberCount}</Typography>

                <Typography variant="body2">
                  Bank Balance: ₹{financialYear.bankBalance.toLocaleString("en-IN")}
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
