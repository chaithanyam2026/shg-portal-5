import { Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import AttendanceRegister from "@/features/reports/ui/AttendanceRegister";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <Stack spacing={3}>
      <PageHeader title="Attendance Register" backHref={`/financial-years/${id}`} />

      <AttendanceRegister financialYearId={id} />
    </Stack>
  );
}
