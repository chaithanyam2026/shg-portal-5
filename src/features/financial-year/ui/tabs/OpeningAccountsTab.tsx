import OpeningAccountsForm from "./OpeningAccountsForm";

import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
};

export default function OpeningAccountsTab({ financialYear }: Props) {
  return <OpeningAccountsForm financialYear={financialYear} />;
}
