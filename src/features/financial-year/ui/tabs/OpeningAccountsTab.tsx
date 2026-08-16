import OpeningAccountsForm from "./OpeningAccountsForm";

import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  canEdit?: boolean;
};

export default function OpeningAccountsTab({ financialYear, canEdit = true }: Props) {
  return <OpeningAccountsForm financialYear={financialYear} canEdit={canEdit} />;
}
