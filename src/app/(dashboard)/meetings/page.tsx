import { listFinancialYears } from "@/features/financial-year/services";
import { listMeetings } from "@/features/meetings/services/list";
import MeetingsPageClient from "@/features/meetings/ui/MeetingsPageClient";

type Props = {
  searchParams: Promise<{
    financialYearId?: string;
  }>;
};

export default async function MeetingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const financialYears = await listFinancialYears();

  const requestedFinancialYearId = params.financialYearId;
  const defaultFinancialYearId =
    financialYears.find((financialYear) => financialYear.status === "IN_PROGRESS")?._id ?? "";

  const financialYearId =
    requestedFinancialYearId === undefined ? defaultFinancialYearId : requestedFinancialYearId;

  const meetings = await listMeetings({
    page: 1,
    pageSize: 500,
    financialYearId: financialYearId || undefined,
    sort: "meetingDate",
  });

  return (
    <MeetingsPageClient
      meetings={meetings.items}
      financialYears={financialYears}
      financialYearId={financialYearId}
    />
  );
}
