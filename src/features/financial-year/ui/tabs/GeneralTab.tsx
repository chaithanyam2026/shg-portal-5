import GeneralForm from "./GeneralForm";

import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
};

export default function GeneralTab({
  financialYear,
}: Props) {
  return (
    <GeneralForm
      financialYear={financialYear}
    />
  );
}