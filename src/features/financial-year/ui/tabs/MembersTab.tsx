import MembersForm from "./MembersForm";

import type { FinancialYearDetails, MemberLookup } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
};

export default function MembersTab({ financialYear, members }: Props) {
  return <MembersForm financialYear={financialYear} members={members} />;
}
