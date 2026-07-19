export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

import { getActiveFinancialYear } from "@/features/financial-year/services/get-active";

import { listMembers } from "@/features/financial-year/services";

import NewLoanPage from "@/features/loans/ui/NewLoanPage";

export default async function Page() {
  const [financialYear, members] = await Promise.all([getActiveFinancialYear(), listMembers()]);

  if (!financialYear) {
    redirect("/financial-years");
  }

  return <NewLoanPage financialYearId={financialYear._id.toString()} members={members} />;
}
