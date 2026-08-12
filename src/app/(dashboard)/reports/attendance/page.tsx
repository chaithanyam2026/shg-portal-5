import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const query = params.financialYear
    ? `?financialYear=${encodeURIComponent(params.financialYear)}`
    : "";

  redirect(`/attendance${query}`);
}
