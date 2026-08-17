import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";
import FinancialYear from "@/models/FinancialYear";

import { FINANCIAL_YEAR_STATUS } from "../domain/financial-year-status";

import { CreateFinancialYearInput, CreateFinancialYearSchema } from "../validation";

import { generateOpeningBalances } from "./generate-opening-balances";
import { populateFinancialYear } from "./internal/populate-financial-year";
import { validateOpeningBalanceSource } from "./internal/validate-opening-balance-source";
import { validateCreateFinancialYear } from "./validate-create";
import { mapFinancialYearDetails, mapMemberOpeningBalancesForPersistence } from "./internal";
import { assertCanAccessFinancialStewardArea } from "./assert-can-access-steward-area";

export async function createFinancialYear(input: CreateFinancialYearInput) {
  await connectMongo();
  await assertCanAccessFinancialStewardArea();

  const data = CreateFinancialYearSchema.parse(input);

  await validateCreateFinancialYear(data);

  let openingBalances = undefined;
  let memberOpeningBalances = undefined;

  if (data.sourceFinancialYearId) {
    await validateOpeningBalanceSource(data.sourceFinancialYearId);

    const opening = await generateOpeningBalances(data.sourceFinancialYearId);

    openingBalances = opening.summary.opening;

    memberOpeningBalances = mapMemberOpeningBalancesForPersistence(
      opening.summary.members,
    );
  } else {
    const opening = await generateOpeningBalances(null);

    openingBalances = opening.summary.opening;

    memberOpeningBalances = mapMemberOpeningBalancesForPersistence(
      opening.summary.members,
    );
  }

  const financialYear = await FinancialYear.create({
    name: data.name,
    startDate: toCalendarDate(data.startDate),
    endDate: toCalendarDate(data.endDate),
    remarks: data.remarks ?? "",

    status: FINANCIAL_YEAR_STATUS.DRAFT,

    sourceFinancialYearId: data.sourceFinancialYearId ?? null,

    openingBalances,

    memberOpeningBalances,
  });

  const populatedFinancialYear = await populateFinancialYear(financialYear);

  const { revalidateFinancialYearWrites } = await import("@/lib/cache");
  revalidateFinancialYearWrites();

  return mapFinancialYearDetails(populatedFinancialYear);
}
