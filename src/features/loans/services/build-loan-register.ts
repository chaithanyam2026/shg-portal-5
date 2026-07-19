import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

export type LoanRegisterItem = {
  loanId: string;
  memberId: string;
  memberName: string;
  principal: number;
  outstandingPrincipal: number;
  outstandingInterest: number;
  totalOutstanding: number;
};

export async function buildLoanRegister(financialYearId: string): Promise<LoanRegisterItem[]> {
  await connectMongo();

  const loans = await Loan.find({
    financialYearId,
  })
    .populate("memberId", "name")
    .lean();

  return loans.map((loan: any) => {
    const principal = loan.principalAmount ?? 0;

    const outstandingPrincipal = loan.outstandingPrincipal ?? 0;

    const outstandingInterest = loan.outstandingInterest ?? 0;

    return {
      loanId: loan._id.toString(),

      memberId: loan.memberId?._id?.toString() ?? "",

      memberName: loan.memberId?.name ?? "",

      principal,

      outstandingPrincipal,

      outstandingInterest,

      totalOutstanding: outstandingPrincipal + outstandingInterest,
    };
  });
}
