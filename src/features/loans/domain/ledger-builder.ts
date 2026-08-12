import type { LoanDetails } from "../types";
import type { LoanPassbook } from "./loan-passbook";

export function buildLoanLedger(loan: LoanDetails): LoanPassbook {
  return {
    loanId: loan._id,

    loanNumber: loan.loanNumber,

    memberId: loan.memberId,

    memberName: loan.memberName,

    loanType: loan.loanType,

    disbursedAmount: loan.disbursedAmount,

    disbursedDate: new Date(loan.disbursedDate),

    entries: [],
  };
}
