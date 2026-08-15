"use client";

import { useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/lib/utils/format";

import type { YearEndIncomeExpenseStatementData } from "../domain/year-end-income-expense-statement";

type Props = {
  statement: YearEndIncomeExpenseStatementData;
};

type CustomLineItem = {
  id: string;

  name: string;

  value: number;
};

type StatementLine = {
  key: string;

  label: string;

  signedValue: number;
};

function createCustomLineId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseAmount(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function SignedAmount({
  value,
  emphasize = false,
}: {
  value: number;
  emphasize?: boolean;
}) {
  const color = value < 0 ? "error.main" : value > 0 ? "success.main" : "text.primary";

  return (
    <Typography
      variant={emphasize ? "subtitle1" : "body2"}
      sx={{
        color,
        fontWeight: emphasize ? 700 : value !== 0 ? 600 : 400,
      }}
    >
      {formatCurrency(value)}
    </Typography>
  );
}

export default function FinancialYearEndIncomeExpenseStatement({ statement }: Props) {
  const [customName, setCustomName] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customLines, setCustomLines] = useState<CustomLineItem[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);

  const fixedLines = useMemo<StatementLine[]>(
    () => [
      {
        key: "bank-balance",
        label: "Bank Balance",
        signedValue: statement.real.bankBalance,
      },
      {
        key: "cash-balance",
        label: "Cash Balance",
        signedValue: statement.real.cashBalance,
      },
      {
        key: "member-loan-total",
        label: "Member Loan Total",
        signedValue: statement.real.memberLoanTotal,
      },
      {
        key: "member-contribution",
        label: "Member Contribution",
        signedValue: -statement.real.memberContributionTotal,
      },
    ],
    [statement.real],
  );

  const allRealLines = useMemo(
    () => [
      ...fixedLines,
      ...customLines.map((line) => ({
        key: line.id,
        label: line.name,
        signedValue: line.value,
      })),
    ],
    [customLines, fixedLines],
  );

  function resetCalculation() {
    setIsCalculated(false);
    setCalculatedTotal(null);
  }

  function handleAddCustomLine() {
    const name = customName.trim();
    const value = parseAmount(customValue);

    if (!name || value === null) {
      return;
    }

    setCustomLines((lines) => [...lines, { id: createCustomLineId(), name, value }]);
    setCustomName("");
    setCustomValue("");
    resetCalculation();
  }

  function handleRemoveCustomLine(id: string) {
    setCustomLines((lines) => lines.filter((line) => line.id !== id));
    resetCalculation();
  }

  function handleCalculate() {
    const total = allRealLines.reduce((sum, line) => sum + line.signedValue, 0);

    setCalculatedTotal(total);
    setIsCalculated(true);
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Year Ending Income Expense Statement</Typography>

        <Typography variant="body2" color="text.secondary">
          Compare expected meeting income against a real reconciliation using SHG balances and member
          summary totals.
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Expected
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>

                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Total Meeting Income</TableCell>

                <TableCell align="right">
                  <SignedAmount value={statement.expected.meetingIncome} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Total Meeting Expense</TableCell>

                <TableCell align="right">
                  <SignedAmount value={-statement.expected.meetingExpense} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Financial Year Loan Interest Income</TableCell>

                <TableCell align="right">
                  <SignedAmount value={statement.expected.loanInterestIncome} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Financial Year Loan Fine Income</TableCell>

                <TableCell align="right">
                  <SignedAmount value={statement.expected.loanFineIncome} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Financial Year Absent Fine Income</TableCell>

                <TableCell align="right">
                  <SignedAmount value={statement.expected.absentFineIncome} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>Expected Net Income</Typography>
                </TableCell>

                <TableCell align="right">
                  <SignedAmount value={statement.expected.netIncome} emphasize />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="text.secondary">
          Expected net income = total meeting income + loan interest + loan fine + absent fine − total
          meeting expense.
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Real
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Amounts with SHG. Member contribution is treated as a negative value.
          </Typography>
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Line Item</TableCell>

                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fixedLines.map((line) => (
                <TableRow key={line.key}>
                  <TableCell>{line.label}</TableCell>

                  <TableCell align="right">
                    {isCalculated ? (
                      <SignedAmount value={line.signedValue} />
                    ) : (
                      <Typography variant="body2">
                        {line.key === "member-contribution"
                          ? `− ${formatCurrency(statement.real.memberContributionTotal)}`
                          : formatCurrency(line.signedValue)}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {customLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.name}</TableCell>

                  <TableCell align="right">
                    {isCalculated ? (
                      <SignedAmount value={line.value} />
                    ) : (
                      <Typography variant="body2">{formatCurrency(line.value)}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Add Line Item</Typography>

            <Alert severity="info" sx={{ py: 0.5 }}>
              Expenses can be added as negative values.
            </Alert>

            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  label="Name"
                  value={customName}
                  onChange={(event) => {
                    setCustomName(event.target.value);
                    resetCalculation();
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Value"
                  value={customValue}
                  onChange={(event) => {
                    setCustomValue(event.target.value);
                    resetCalculation();
                  }}
                  fullWidth
                  size="small"
                  type="number"
                  helperText="Use negative for expenses"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddCustomLine}
                  disabled={!customName.trim() || parseAmount(customValue) === null}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            {customLines.length > 0 && (
              <Stack spacing={1}>
                {customLines.map((line) => (
                  <Box
                    key={line.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2">
                      {line.name}: {formatCurrency(line.value)}
                    </Typography>

                    <IconButton
                      aria-label={`Remove ${line.name}`}
                      size="small"
                      onClick={() => handleRemoveCustomLine(line.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>

        <Box>
          <Button variant="contained" onClick={handleCalculate}>
            Calculate
          </Button>
        </Box>

        {isCalculated && calculatedTotal !== null && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderColor: calculatedTotal < 0 ? "error.light" : "success.light",
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Real Income / Expense Total
              </Typography>

              <SignedAmount value={calculatedTotal} emphasize />
            </Stack>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}
