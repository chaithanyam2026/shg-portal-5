import type { PropsWithChildren } from "react";

import { requireFinancialStewardArea } from "@/features/financial-year/services";

export default async function FinancialYearsLayout({ children }: PropsWithChildren) {
  await requireFinancialStewardArea();

  return children;
}
