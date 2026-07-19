import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

/**
 * Generates the next sequential loan number
 * for the given financial year.
 *
 * Format:
 * LN-2026-0001
 */
export async function generateNextLoanNumber(financialYearId: string) {
  await connectMongo();

  const latestLoan = await Loan.findOne({
    financialYearId,
  })
    .sort({
      sequenceNumber: -1,
    })
    .select({
      sequenceNumber: 1,
    })
    .lean();

  const sequenceNumber = (latestLoan?.sequenceNumber ?? 0) + 1;

  return {
    sequenceNumber,

    loanNumber: `LN-${new Date().getFullYear()}-${sequenceNumber.toString().padStart(4, "0")}`,
  };
}
