"use client";

import { useState, useMemo } from "react";


import {
    Alert,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";
import {
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";

import type {
    MemberLookup,
} from "@/features/financial-year/types";

import type {
    CreateLoanInput,
} from "../validation";

import {
    LOAN_TYPES,
} from "../domain";

type Props = {
    financialYearId: string;

    members: MemberLookup[];

    loading?: boolean;

    onSubmit(
        values: CreateLoanInput,
    ): Promise<void>;
};

export default function LoanForm({
    financialYearId,
    members,
    loading = false,
    onSubmit,
}: Props) {
    const [values, setValues] =
        useState<CreateLoanInput>({
            financialYearId,

            memberId: "",

            loanType:
                LOAN_TYPES[0],

            sanctionedAmount: 0,

            disbursedAmount: 0,

            interestRate: 0,

            expectedMonthlyRepayment: 0,

            disbursedDate:
                new Date()
                    .toISOString()
                    .split("T")[0],

            remarks: "",
        });

    const [error, setError] =
        useState("");

    const validationError =
        useMemo(() => {
            if (!values.memberId) {
                return "Please select a member.";
            }

            if (
                values.sanctionedAmount <=
                0
            ) {
                return "Sanctioned amount must be greater than zero.";
            }

            if (
                values.disbursedAmount <=
                0
            ) {
                return "Disbursed amount must be greater than zero.";
            }

            if (
                values.disbursedAmount >
                values.sanctionedAmount
            ) {
                return "Disbursed amount cannot exceed sanctioned amount.";
            }

            if (
                values.interestRate < 0
            ) {
                return "Interest rate cannot be negative.";
            }

            if (
                values.expectedMonthlyRepayment <=
                0
            ) {
                return "Minimum monthly repayment must be greater than zero.";
            }

            if (
                !values.disbursedDate
            ) {
                return "Please select the disbursed date.";
            }

            return "";
        }, [values]);

    async function submit() {
        if (validationError) {
            setError(
                validationError,
            );

            return;
        }

        setError("");

        try {
            await onSubmit(
                values,
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create loan.",
            );
        }
    }

    return (
        <Card>
            <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        New Loan
                    </Typography>

                    {(error ||
                        validationError) && (
                            <Alert severity="error">
                                {error ||
                                    validationError}
                            </Alert>
                        )}

                    <FormControl
                        fullWidth
                        required
                    >
                        <InputLabel>
                            Member
                        </InputLabel>

                        <Select
                            label="Member"
                            value={
                                values.memberId
                            }
                            onChange={(
                                event,
                            ) =>
                                setValues({
                                    ...values,
                                    memberId:
                                        event.target
                                            .value,
                                })
                            }
                        >
                            {members.map(
                                (
                                    member,
                                ) => (
                                    <MenuItem
                                        key={
                                            member._id
                                        }
                                        value={
                                            member._id
                                        }
                                    >
                                        {
                                            member.memberCode
                                        }{" "}
                                        —{" "}
                                        {
                                            member.name
                                        }
                                    </MenuItem>
                                ),
                            )}
                        </Select>
                    </FormControl>

                    <FormControl
                        fullWidth
                        required
                    >
                        <InputLabel>
                            Loan Type
                        </InputLabel>

                        <Select
                            label="Loan Type"
                            value={
                                values.loanType
                            }
                            onChange={(
                                event,
                            ) =>
                                setValues({
                                    ...values,
                                    loanType:
                                        event.target
                                            .value as CreateLoanInput["loanType"],
                                })
                            }
                        >
                            {LOAN_TYPES.map(
                                (type) => (
                                    <MenuItem
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </MenuItem>
                                ),
                            )}
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
                            value={
                                values.sanctionedAmount
                            }
                            onChange={(
                                event,
                            ) =>
                                setValues({
                                    ...values,
                                    sanctionedAmount:
                                        Number(
                                            event.target.value,
                                        ),
                                })
                            }
                        />

                        <TextField
                            label="Disbursed Amount"
                            type="number"
                            fullWidth
                            required
                            value={
                                values.disbursedAmount
                            }
                            onChange={(
                                event,
                            ) =>
                                setValues({
                                    ...values,
                                    disbursedAmount:
                                        Number(
                                            event.target.value,
                                        ),
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
                            label="Interest Rate (%)"
                            type="number"
                            fullWidth
                            required
                            value={
                                values.interestRate
                            }
                            onChange={(
                                event,
                            ) =>
                                setValues({
                                    ...values,
                                    interestRate:
                                        Number(
                                            event.target.value,
                                        ),
                                })
                            }
                        />

                        <TextField
                            label="Minimum Monthly Repayment"
                            type="number"
                            fullWidth
                            required
                            value={
                                values.expectedMonthlyRepayment
                            }
                            onChange={(
                                event,
                            ) =>
                                setValues({
                                    ...values,
                                    expectedMonthlyRepayment:
                                        Number(
                                            event.target.value,
                                        ),
                                })
                            }
                        />
                    </Stack>

                    <TextField
                        label="Disbursed Date"
                        type="date"
                        fullWidth
                        required
                        value={
                            values.disbursedDate
                        }
                        onChange={(
                            event,
                        ) =>
                            setValues({
                                ...values,
                                disbursedDate:
                                    event.target.value,
                            })
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <TextField
                        label="Remarks"
                        fullWidth
                        multiline
                        minRows={3}
                        value={
                            values.remarks
                        }
                        onChange={(
                            event,
                        ) =>
                            setValues({
                                ...values,
                                remarks:
                                    event.target.value,
                            })
                        }
                    />

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            type="button"
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={submit}
                            disabled={
                                loading ||
                                Boolean(
                                    validationError,
                                )
                            }
                        >
                            {loading
                                ? "Creating..."
                                : "Create Loan"}
                        </Button>
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    );
}