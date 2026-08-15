import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MemberTransactionsPage({ params }: Props) {
  const { id } = await params;

  redirect(`/meetings/${id}?tab=members`);
}
