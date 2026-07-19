/* import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import {
  buildLoanLedger,
} from "@/features/loans/services/internal/loan-ledger";

export async function getMemberLoans(
  memberId: string,
) {
  await connectMongo();

  const loans =
    await Loan.find({
      memberId,
    })
      .sort({
        disbursedDate: -1,
      })
      .lean();

  return Promise.all(
    loans.map(
      async (loan) => {
        const ledger =
          await buildLoanLedger({
            _id: loan._id,

            loanNumber:
              loan.loanNumber,

            memberId:
              loan.memberId,

            memberName: "",

            loanType:
              loan.loanType,

            disbursedAmount:
              loan.disbursedAmount,

            interestRate:
              loan.interestRate,

            expectedMonthlyRepayment:
              loan.expectedMonthlyRepayment,

            disbursedDate:
              loan.disbursedDate,
          });

        return {
          _id:
            loan._id.toString(),

          loanNumber:
            loan.loanNumber,

          loanType:
            loan.loanType,

          status:
            loan.status,

          disbursedAmount:
            loan.disbursedAmount,

          disbursedDate:
            loan.disbursedDate,

          outstandingPrincipal:
            ledger.summary
              .outstandingPrincipal,
        };
      },
    ),
  );
} */
import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import { getLoanPassbook } from "@/features/loans/services";

export async function getMemberLoans(memberId: string) {
  await connectMongo();

  const loans = await Loan.find({
    memberId,
  })
    .sort({
      disbursedDate: -1,
    })
    .lean();

  return Promise.all(
    loans.map(async (loan) => {
      const passbook = await getLoanPassbook(loan._id.toString());

      const lastEntry = passbook.entries.at(-1);

      return {
        _id: loan._id.toString(),

        loanNumber: loan.loanNumber,

        loanType: loan.loanType,

        status: loan.status,

        disbursedAmount: loan.disbursedAmount,

        disbursedDate: loan.disbursedDate,

        outstandingPrincipal: lastEntry?.outstandingPrincipal ?? loan.disbursedAmount,
      };
    }),
  );
}
