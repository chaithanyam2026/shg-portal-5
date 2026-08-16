import GeneralForm from "./GeneralForm";

import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  canEdit?: boolean;
};

export default function GeneralTab({ financialYear, canEdit = true }: Props) {
  return <GeneralForm financialYear={financialYear} canEdit={canEdit} />;
}
