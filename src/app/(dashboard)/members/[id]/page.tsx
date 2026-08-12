import { notFound } from "next/navigation";

import {
  getDefaultMemberFinancialYearId,
  getMember,
  listMemberFinancialYearOptions,
} from "@/features/members/services";
import MemberTabs from "@/features/members/ui/MemberTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  try {
    const [member, financialYearOptions] = await Promise.all([
      getMember(id),
      listMemberFinancialYearOptions(id),
    ]);

    const initialFinancialYearId = getDefaultMemberFinancialYearId(financialYearOptions) ?? "";

    return (
      <MemberTabs
        member={member}
        financialYearOptions={financialYearOptions}
        initialFinancialYearId={initialFinancialYearId}
      />
    );
  } catch {
    notFound();
  }
}
