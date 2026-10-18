import connectMongo from "@/lib/db/mongodb";
import Loan from "@/models/Loan";

const LOAN_NUMBER_PATTERN = /^LN-(\d{4})-(\d+)$/;

/**
 * Meeting loans are numbered LN-{calendar year}-{sequence}.
 * Opening-balance loans use the financial year name and share the
 * per-year sequence, so the LN number must be taken from the global
 * series. Otherwise the first meeting loan in a new year can reuse a
 * number already issued in the previous year (for example LN-2026-0011).
 */
export async function generateNextLoanNumber(financialYearId: string) {
  await connectMongo();

  const year = new Date().getFullYear();
  const prefix = `LN-${year}-`;

  const [latestInFinancialYear, latestNumbered] = await Promise.all([
    Loan.findOne({ financialYearId })
      .sort({ sequenceNumber: -1 })
      .select({ sequenceNumber: 1 })
      .lean(),
    Loan.findOne({
      loanNumber: { $regex: `^${prefix}\\d+$` },
    })
      .sort({ loanNumber: -1 })
      .select({ loanNumber: 1 })
      .lean(),
  ]);

  const sequenceNumber = (latestInFinancialYear?.sequenceNumber ?? 0) + 1;
  const matched = latestNumbered?.loanNumber.match(LOAN_NUMBER_PATTERN);
  let numberSequence = matched ? Number(matched[2]) : 0;
  let loanNumber = formatLoanNumber(year, numberSequence + 1);

  while (await Loan.exists({ loanNumber })) {
    numberSequence += 1;
    loanNumber = formatLoanNumber(year, numberSequence + 1);
  }

  return {
    sequenceNumber,
    loanNumber,
  };
}

function formatLoanNumber(year: number, sequence: number) {
  return `LN-${year}-${sequence.toString().padStart(4, "0")}`;
}
