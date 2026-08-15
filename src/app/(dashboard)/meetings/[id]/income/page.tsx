import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IncomePage({ params }: Props) {
  const { id } = await params;

  redirect(`/meetings/${id}?tab=income`);
}
