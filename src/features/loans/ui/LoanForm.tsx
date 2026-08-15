"use client";

import Link from "next/link";

import { useMemo, useState } from "react";

import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { MemberLookup } from "@/features/financial-year/types";
import { parseDateInputValue } from "@/lib/utils/date";

import { LOAN_TYPES, SPECIAL_LOAN_TYPE } from "../domain";
import MinimumMonthlyRepaymentField from "./MinimumMonthlyRepaymentField";

import type { CreateLoanInput } from "../validation";

type Props = {
  financialYearId: string;

  members: MemberLookup[];

  loading?: boolean;

  cancelHref?: string;

  defaultSanctionedDate?: string;

  defaultStartDate?: string;

  onSubmit(values: CreateLoanInput): Promise<void>;
};

type LoanFormValues = {
  financialYearId: string;
  memberId: string;
  loanType: CreateLoanInput["loanType"];
  sanctionedAmount: number;
  disbursedAmount: number;
  interestRate: number;
  expectedMonthlyRepayment: number;
  sanctionedDate: string;
  disbursedDate: string;
  expiryDate: string;
  remarks: string;
};

function toDateInputValue(value?: string): string {
  if (!value) {
    return new Date().toISOString().split("T")[0];
  }

  return value.split("T")[0];
}

export default function LoanForm({
  financialYearId,
  members,
  loading = false,
  cancelHref = "/loans",
  defaultSanctionedDate,
  defaultStartDate,
  onSubmit,
}: Props) {
  const initialDate = toDateInputValue(defaultStartDate ?? defaultSanctionedDate);

  const [values, setValues] = useState<LoanFormValues>({
    financialYearId,
    memberId: "",
    loanType: LOAN_TYPES[0],
    sanctionedAmount: 0,
    disbursedAmount: 0,
    interestRate: 10,
    expectedMonthlyRepayment: 0,
    sanctionedDate: toDateInputValue(defaultSanctionedDate ?? defaultStartDate),
    disbursedDate: initialDate,
    expiryDate: "",
    remarks: "",
  });

  const [error, setError] = useState("");

  const validationError = useMemo(() => {
    if (!values.memberId) {
      return "Please select a member.";
    }

    if (values.sanctionedAmount <= 0) {
      return "Sanctioned amount must be greater than zero.";
    }

    if (values.disbursedAmount <= 0) {
      return "Disbursed amount must be greater than zero.";
    }

    if (values.disbursedAmount > values.sanctionedAmount) {
      return "Disbursed amount cannot exceed sanctioned amount.";
    }

    if (values.interestRate < 0) {
      return "Interest rate cannot be negative.";
    }

    if (values.expectedMonthlyRepayment < 0) {
      return "Minimum monthly repayment cannot be negative.";
    }

    if (values.expectedMonthlyRepayment > values.disbursedAmount) {
      return "Minimum monthly repayment cannot exceed the disbursed amount.";
    }

    if (!values.sanctionedDate) {
      return "Please select the sanctioned date.";
    }

    if (!values.disbursedDate) {
      return "Please select the start date.";
    }

    if (parseDateInputValue(values.disbursedDate) < parseDateInputValue(values.sanctionedDate)) {
      return "Start date cannot be before the sanctioned date.";
    }

    if (values.loanType === SPECIAL_LOAN_TYPE && !values.expiryDate) {
      return "Expiry date is required for special loans.";
    }

    if (
      values.expiryDate &&
      parseDateInputValue(values.expiryDate) < parseDateInputValue(values.disbursedDate)
    ) {
      return "Expiry date cannot be before the start date.";
    }

    return "";
  }, [values]);

  async function submit() {
    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    try {
      await onSubmit({
        financialYearId: values.financialYearId,
        memberId: values.memberId,
        loanType: values.loanType,
        sanctionedAmount: values.sanctionedAmount,
        disbursedAmount: values.disbursedAmount,
        interestRate: values.interestRate,
        expectedMonthlyRepayment: values.expectedMonthlyRepayment,
        sanctionedDate: parseDateInputValue(values.sanctionedDate),
        disbursedDate: parseDateInputValue(values.disbursedDate),
        expiryDate: values.expiryDate ? parseDateInputValue(values.expiryDate) : null,
        remarks: values.remarks,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create loan.");
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">New Loan</Typography>

          {(error || validationError) && <Alert severity="error">{error || validationError}</Alert>}

          <FormControl fullWidth required>
            <InputLabel>Member</InputLabel>

            <Select
              label="Member"
              value={values.memberId}
              onChange={(event) =>
                setValues({
                  ...values,
                  memberId: event.target.value,
                })
              }
            >
              {members.map((member) => (
                <MenuItem key={member._id} value={member._id}>
                  {member.memberCode} — {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Loan Type</InputLabel>

            <Select
              label="Loan Type"
              value={values.loanType}
              onChange={(event) =>
                setValues({
                  ...values,
                  loanType: event.target.value as LoanFormValues["loanType"],
                })
              }
            >
              {LOAN_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="Sanctioned Amount"
              type="number"
              fullWidth
              required
              value={values.sanctionedAmount}
              onChange={(event) =>
                setValues({
                  ...values,
                  sanctionedAmount: Number(event.target.value),
                })
              }
            />

            <TextField
              label="Disbursed Amount"
              type="number"
              fullWidth
              required
              value={values.disbursedAmount}
              onChange={(event) =>
                setValues({
                  ...values,
                  disbursedAmount: Number(event.target.value),
                })
              }
            />
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="Sanctioned Date"
              type="date"
              fullWidth
              required
              value={values.sanctionedDate}
              onChange={(event) =>
                setValues({
                  ...values,
                  sanctionedDate: event.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Start Date"
              type="date"
              fullWidth
              required
              value={values.disbursedDate}
              onChange={(event) =>
                setValues({
                  ...values,
                  disbursedDate: event.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            {values.loanType === SPECIAL_LOAN_TYPE && (
              <TextField
                label="Expiry Date"
                type="date"
                fullWidth
                required
                value={values.expiryDate}
                onChange={(event) =>
                  setValues({
                    ...values,
                    expiryDate: event.target.value,
                  })
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="Interest Rate (%)"
              type="number"
              fullWidth
              required
              value={values.interestRate}
              onChange={(event) =>
                setValues({
                  ...values,
                  interestRate: Number(event.target.value),
                })
              }
            />

            <MinimumMonthlyRepaymentField
              disbursedAmount={values.disbursedAmount}
              value={values.expectedMonthlyRepayment}
              onChange={(expectedMonthlyRepayment) =>
                setValues((current) => ({
                  ...current,
                  expectedMonthlyRepayment,
                }))
              }
            />
          </Stack>

          <TextField
            label="Remarks"
            fullWidth
            multiline
            minRows={3}
            value={values.remarks}
            onChange={(event) =>
              setValues({
                ...values,
                remarks: event.target.value,
              })
            }
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" component={Link} href={cancelHref}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={submit}
              disabled={loading || Boolean(validationError)}
            >
              {loading ? "Creating..." : "Create Loan"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
