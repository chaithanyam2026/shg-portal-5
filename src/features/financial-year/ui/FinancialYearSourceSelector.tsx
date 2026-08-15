"use client";

import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

import type { OpeningBalanceSourceFinancialYearLookup } from "../types";

type Props = {
  financialYears: OpeningBalanceSourceFinancialYearLookup[];

  value: string;

  onChange: (value: string) => void;
};

function sourceStatusColor(
  status: OpeningBalanceSourceFinancialYearLookup["status"],
): "success" | "warning" | "info" {
  switch (status) {
    case "CLOSED":
      return "success";
    case "VALIDATED":
      return "warning";
    case "APPROVED":
      return "info";
  }
}

export default function FinancialYearSourceSelector({ financialYears, value, onChange }: Props) {
  console.log('financialYears', { financialYears })
  return (
    <Stack spacing={2}>
      {financialYears.map((financialYear) => (
        <Card
          key={financialYear._id}
          variant={value === financialYear._id ? "outlined" : undefined}
        >
          <CardActionArea onClick={() => {
            console.log("Selected:", financialYear._id);
            onChange(financialYear._id);
          }}>
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

                  <Chip color={sourceStatusColor(financialYear.status)} label={financialYear.status} />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {financialYear.status === "CLOSED" ? "Closed" : "Ends"}:{" "}
                  {financialYear.status === "CLOSED" && financialYear.closedAt
                    ? new Date(financialYear.closedAt).toLocaleDateString("en-IN")
                    : new Date(financialYear.endDate).toLocaleDateString("en-IN")}
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
