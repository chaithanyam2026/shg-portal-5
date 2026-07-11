import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import {
    BANK_TRANSACTION_TYPE,
} from "../domain/bank-transaction";

import type {
    MeetingSummary,
    SummaryValidation,
} from "../types";
import {
    VALIDATION_CODE,
    VALIDATION_SEVERITY,
} from "../domain/summary";

export async function getSummary(
    meetingId: string,
): Promise<MeetingSummary> {
    await connectMongo();

    const meeting =
        await Meeting.findById(
            meetingId,
        ).lean();

    if (!meeting) {
        throw new Error(
            "Meeting not found.",
        );
    }

    const attendance =
        meeting.attendance ?? [];

    const payments =
        meeting.payments ?? [];

    const bankTransactions =
        meeting.bankTransactions ?? [];

    const otherIncomes =
        meeting.otherIncomes ?? [];

    const expenses =
        meeting.expenses ?? [];

    const attendanceSummary = {
        totalMembers:
            attendance.length,

        present:
            attendance.filter(
                (x) =>
                    x.status ===
                    "PRESENT",
            ).length,

        absent:
            attendance.filter(
                (x) =>
                    x.status ===
                    "ABSENT",
            ).length,

        excused:
            attendance.filter(
                (x) =>
                    x.status ===
                    "EXCUSED",
            ).length,
    };

    const paymentSummary = {
        contribution:
            payments.reduce(
                (s, p) =>
                    s + p.contribution,
                0,
            ),

        loanRepayment:
            payments.reduce(
                (s, p) =>
                    s +
                    p.loanRepayment,
                0,
            ),

        absentFine:
            payments.reduce(
                (s, p) =>
                    s + p.absentFine,
                0,
            ),

        specialLoanFine:
            payments.reduce(
                (s, p) =>
                    s +
                    p.specialLoanFine,
                0,
            ),
    };

    const totalCollection =
        paymentSummary.contribution +
        paymentSummary.loanRepayment +
        paymentSummary.absentFine +
        paymentSummary.specialLoanFine;

    const bankDeposits =
        bankTransactions
            .filter((x) =>
                [
                    BANK_TRANSACTION_TYPE.DEPOSIT,
                    BANK_TRANSACTION_TYPE.INTEREST,
                    BANK_TRANSACTION_TYPE.INVESTMENT_MATURITY,
                ].includes(x.type),
            )
            .reduce(
                (s, x) =>
                    s + x.amount,
                0,
            );

    const bankWithdrawals =
        bankTransactions
            .filter((x) =>
                [
                    BANK_TRANSACTION_TYPE.WITHDRAWAL,
                    BANK_TRANSACTION_TYPE.INVESTMENT,
                    BANK_TRANSACTION_TYPE.BANK_CHARGE,
                ].includes(x.type),
            )
            .reduce(
                (s, x) =>
                    s + x.amount,
                0,
            );

    const totalIncome =
        otherIncomes.reduce(
            (s, x) =>
                s + x.amount,
            0,
        );

    const totalExpense =
        expenses.reduce(
            (s, x) =>
                s + x.amount,
            0,
        );

    const validations: SummaryValidation[] =
        [];

    validations.push({
        code:
            VALIDATION_CODE.ATTENDANCE,

        title: "Attendance",

        severity:
            attendance.length > 0
                ? VALIDATION_SEVERITY.SUCCESS
                : VALIDATION_SEVERITY.ERROR,

        message:
            attendance.length > 0
                ? "Attendance completed."
                : "Attendance is missing.",
    });

    validations.push({
        code:
            VALIDATION_CODE.PAYMENTS,

        title: "Payments",

        severity:
            payments.length > 0
                ? VALIDATION_SEVERITY.SUCCESS
                : VALIDATION_SEVERITY.ERROR,

        message:
            payments.length > 0
                ? "Payments completed."
                : "Payments are missing.",
    });

    validations.push({
        code:
            VALIDATION_CODE.BANK,

        title: "Bank Transactions",

        severity:
            VALIDATION_SEVERITY.SUCCESS,

        message:
            "Bank transactions reviewed.",
    });

    validations.push({
        code:
            VALIDATION_CODE.INCOME,

        title: "Other Income",

        severity:
            VALIDATION_SEVERITY.SUCCESS,

        message:
            "Other income reviewed.",
    });

    validations.push({
        code:
            VALIDATION_CODE.EXPENSES,

        title: "Expenses",

        severity:
            VALIDATION_SEVERITY.SUCCESS,

        message:
            "Expenses reviewed.",
    });

    const canClose =
        validations.every(
            (validation) =>
                validation.severity !==
                VALIDATION_SEVERITY.ERROR,
        );

    validations.push({
        code:
            VALIDATION_CODE.READY_TO_CLOSE,

        title: "Meeting",

        severity: canClose
            ? VALIDATION_SEVERITY.SUCCESS
            : VALIDATION_SEVERITY.ERROR,

        message: canClose
            ? "Meeting is ready to close."
            : "Meeting cannot be closed until all required sections are complete.",
    });

    return {
        meetingId:
            meeting._id.toString(),

        status:
            meeting.status,

        meetingDate:
            meeting.meetingDate.toISOString(),

        place:
            meeting.place,

        startedAt:
            meeting.startedAt
                ? meeting.startedAt.toISOString()
                : null,

        attendance:
            attendanceSummary,

        payments: {
            ...paymentSummary,
            totalCollection,
        },

        bank: {
            meetingId:
                meeting._id.toString(),

            status:
                meeting.status,

            records:
                bankTransactions.map(
                    (x) => ({
                        transactionDate:
                            x.transactionDate.toISOString(),
                        type: x.type,
                        amount:
                            x.amount,
                        remarks:
                            x.remarks,
                    }),
                ),

            totalDeposits:
                bankDeposits,

            totalWithdrawals:
                bankWithdrawals,

            netAmount:
                bankDeposits -
                bankWithdrawals,
        },

        income: {
            meetingId:
                meeting._id.toString(),

            status:
                meeting.status,

            records:
                otherIncomes.map(
                    (x) => ({
                        transactionDate:
                            x.transactionDate.toISOString(),
                        category:
                            x.category,
                        amount:
                            x.amount,
                        remarks:
                            x.remarks,
                    }),
                ),

            totalIncome,
        },

        expenses: {
            meetingId:
                meeting._id.toString(),

            status:
                meeting.status,

            records:
                expenses.map(
                    (x) => ({
                        transactionDate:
                            x.transactionDate.toISOString(),
                        category:
                            x.category,
                        amount:
                            x.amount,
                        remarks:
                            x.remarks,
                    }),
                ),

            totalExpense,
        },

        financial: {
            memberCollection:
                totalCollection,

            otherIncome:
                totalIncome,

            expenses:
                totalExpense,

            netMeetingCollection:
                totalCollection +
                totalIncome -
                totalExpense,

            bankDeposits,

            bankWithdrawals,

            netBankMovement:
                bankDeposits -
                bankWithdrawals,
        },

        validations,

        canClose,
    };
}