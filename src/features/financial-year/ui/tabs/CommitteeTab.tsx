import CommitteeForm from "./CommitteeForm";

import type { FinancialYearDetails, MemberLookup } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
};

export default function CommitteeTab({ financialYear, members }: Props) {
  return <CommitteeForm financialYear={financialYear} members={members} />;
}
