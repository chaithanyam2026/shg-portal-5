import CommitteeForm from "./CommitteeForm";

import type { FinancialYearDetails, MemberLookup } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
  canEdit?: boolean;
};

export default function CommitteeTab({ financialYear, members, canEdit = true }: Props) {
  return <CommitteeForm financialYear={financialYear} members={members} canEdit={canEdit} />;
}
