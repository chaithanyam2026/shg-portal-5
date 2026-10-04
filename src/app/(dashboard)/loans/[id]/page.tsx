import { notFound } from "next/navigation";

import { getLoanDetailPage } from "@/features/loans/services";

import LoanTabs from "@/features/loans/ui/LoanTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  try {
    const { loan, summary, passbook } = await getLoanDetailPage(id);
    return <LoanTabs loan={loan} summary={summary} passbook={passbook} />;
  } catch {
    notFound();
  }
}
