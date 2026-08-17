import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildLoanRegister } from "@/features/reports/services/build-loan-register";
import LoanRegisterPage from "@/features/reports/ui/LoanRegisterPage";
import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  if (!financialYear) {
    return (
      <>
        <PageHeader title="Loan Register" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const register = await buildLoanRegister(financialYear._id);

  return (
    <>
      <PageHeader title="Loan Register" backHref="/reports" />

      <LoanRegisterPage financialYearId={financialYear._id} options={options} register={register} />
    </>
  );
}
