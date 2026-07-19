import FinancialYear from "@/models/FinancialYear";

export type OpeningBalanceSource = {
  financialYearId: string;
};

export async function validateOpeningBalanceSource(
  source: OpeningBalanceSource,
): Promise<void> {
  const financialYear = await FinancialYear.findById(
    source.financialYearId,
  ).select("_id status");

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  if (financialYear.status !== "CLOSED") {
    throw new Error(
      "Opening balances can only be created from a closed financial year.",
    );
  }
}
