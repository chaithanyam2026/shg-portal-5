// import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

import {
    LOAN_STATUS,
  NORMAL_LOAN_TYPE,
  SPECIAL_LOAN_TYPE,
} from "../domain";

import {
  ACTIVE_LOAN_STATUS,
} from "../domain";

type Input = {
    financialYearId: string;
};

/**
 * Creates opening loans from the
 * Financial Year's opening balances.
 *
 * This is intended to run exactly
 * once during Financial Year activation.
 */
export async function createOpeningLoans({
    financialYearId,
}: Input): Promise<void> {
    //await connectMongo();

    const financialYear =
        await FinancialYear.findById(
            financialYearId,
        ).lean();

    if (
        financialYear.members.length === 0
    ) {
        return;
    }

    if (!financialYear) {
        throw new Error(
            "Financial Year not found.",
        );
    }

    let sequenceNumber = 1;

    for (const member of financialYear.members) {
        const opening =
            member.opening ?? {
                loan: 0,
                specialLoan: 0,
            };

        if (
            opening.loan <= 0 &&
            opening.specialLoan <= 0
        ) {
            continue;
        }

        if (
            opening.loan > 0
        ) {
            await createLoan({
                financialYear,
                memberId:
                    member.memberId,
                sequenceNumber:
                    sequenceNumber++,
                amount:
                    opening.loan,
                loanType:
                    NORMAL_LOAN_TYPE
            });
        }

        if (
            opening.specialLoan > 0
        ) {
            await createLoan({
                financialYear,
                memberId:
                    member.memberId,
                sequenceNumber:
                    sequenceNumber++,
                amount:
                    opening.specialLoan,
                loanType:
                    SPECIAL_LOAN_TYPE,
                expiryDate:
                    opening.specialLoanExpiry,
            });
        }
    }
}

type CreateLoanInput = {
    financialYear: Awaited<
        ReturnType<
            typeof FinancialYear.findById
        >
    > extends {
        toObject(): infer T;
    }
    ? T
    : never;

    memberId: unknown;

    sequenceNumber: number;

    amount: number;

    loanType: string;

    expiryDate?: Date | null;
};

async function createLoan({
    financialYear,
    memberId,
    sequenceNumber,
    amount,
    loanType,
    expiryDate = null,
}: CreateLoanInput) {
    const loanNumber =
        `${financialYear.name}-${String(
            sequenceNumber,
        ).padStart(4, "0")}`;

    const existing =
        await Loan.exists({
            financialYearId:
                financialYear._id,

            memberId,

            loanType,
        });

    if (existing) {
        return;
    }

    await Loan.create({
        financialYearId:
            financialYear._id,

        memberId,

        loanNumber,

        sequenceNumber,

        loanType,

        status:
            LOAN_STATUS.ACTIVE,

        sanctionedAmount:
            amount,

        disbursedAmount:
            amount,

        interestRate: 10,

        expectedMonthlyRepayment: 0,

        disbursedDate:
            financialYear.startDate,

        expiryDate,

        remarks:
            "Opening balance migration",
    });
}