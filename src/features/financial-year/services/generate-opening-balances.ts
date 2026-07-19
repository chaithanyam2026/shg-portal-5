import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import { buildOpeningBalances } from "./internal";
import { validateOpeningBalanceSource } from "./internal";

export type OpeningBalanceResult = ReturnType<typeof buildOpeningBalances>;

export async function generateOpeningBalances(
  sourceFinancialYearId: string | null,
): Promise<OpeningBalanceResult> {
  //
  // First financial year
  //
  if (!sourceFinancialYearId) {
    return buildOpeningBalances(null);
  }

  await connectMongo();

  const sourceFinancialYear =
    await FinancialYear.findById(sourceFinancialYearId);

  if (!sourceFinancialYear) {
    throw new Error("Source financial year not found.");
  }

  validateOpeningBalanceSource(sourceFinancialYear);

  return buildOpeningBalances(
    sourceFinancialYear.closing,
  );
}