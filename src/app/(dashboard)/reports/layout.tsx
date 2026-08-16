import type { PropsWithChildren } from "react";

import { requireFinancialStewardArea } from "@/features/financial-year/services";

export default async function ReportsLayout({ children }: PropsWithChildren) {
  await requireFinancialStewardArea();

  return children;
}
