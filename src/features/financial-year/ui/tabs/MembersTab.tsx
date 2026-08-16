import MembersForm from "./MembersForm";

import type { FinancialYearDetails, MemberLookup } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
  canEdit?: boolean;
};

export default function MembersTab({ financialYear, members, canEdit = true }: Props) {
  return <MembersForm financialYear={financialYear} members={members} canEdit={canEdit} />;
}
