import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildLoanRegister } from "@/features/reports/services/build-loan-register";
import LoanRegisterPage from "@/features/reports/ui/LoanRegisterPage";

import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const financialYear = await getSelectedFinancialYear(params.financialYear);

  if (!financialYear) {
    redirect("/financial-years");
  }

  const financialYearId = financialYear._id.toString();

  const [options, register] = await Promise.all([
    listFinancialYearOptions(),
    buildLoanRegister(financialYearId),
  ]);

  return (
    <>
      <PageHeader title="Loan Register" backHref="/reports" />

      <LoanRegisterPage financialYearId={financialYearId} options={options} register={register} />
    </>
  );
}
