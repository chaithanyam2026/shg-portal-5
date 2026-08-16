import NewMemberPage from "@/features/members/ui/NewMemberPage";
import { requireFinancialStewardArea } from "@/features/financial-year/services";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireFinancialStewardArea();

  return <NewMemberPage />;
}
