import { getActiveFinancialYear } from "@/features/financial-year/services/get-active";
import { toCalendarDate } from "@/lib/utils/date";

import { toSundayDateValues } from "../../domain";

export async function loadChittySundayOptions(now = new Date()): Promise<string[]> {
  const financialYear = await getActiveFinancialYear();
  const startDate = financialYear?.startDate ?? toCalendarDate(now);

  return toSundayDateValues(startDate, now);
}
