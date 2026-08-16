import { notFound } from "next/navigation";

import { Alert, Chip, Stack } from "@mui/material";

import { auth } from "@/auth";
import PageHeader from "@/components/layout/PageHeader";
import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";
import { canReopenFinancialYear } from "@/features/financial-year/domain/financial-year-lifecycle";
import { get } from "@/features/financial-year/services/get";
import { canCurrentUserEditFinancialYear } from "@/features/financial-year/services/can-edit-fields";
import FinancialYearTabs from "@/features/financial-year/ui/FinancialYearTabs";
import { list as listMembers } from "@/features/member/services/list";
import { buildIncomeExpenseReport } from "@/features/reports/services";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { isAdminRole } from "@/lib/auth/roles";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

function getStatusColor(
  status: FinancialYearStatus,
): "default" | "primary" | "success" | "warning" | "error" {
  switch (status) {
    case "APPROVED":
      return "success";

    case "VALIDATED":
      return "primary";

    case "IN_PROGRESS":
      return "warning";

    case "CLOSED":
      return "default";

    case "DRAFT":
    default:
      return "default";
  }
}

export default async function FinancialYearDetailsPage({ params }: PageProps) {
  try {
    await connectMongo();

    const { id } = await params;

    const financialYear = await get(id);
    const session = await auth();
    const canEdit = await canCurrentUserEditFinancialYear(financialYear);
    const canReopen =
      isAdminRole(session?.user?.role) && canReopenFinancialYear(financialYear.status);

    const [members, report] = await Promise.all([listMembers(), buildIncomeExpenseReport(id)]);

    return (
      <Stack spacing={3}>
        <PageHeader
          title={financialYear.name}
          subtitle="Financial year details"
          backHref="/financial-years"
        >
          <Chip label={financialYear.status} color={getStatusColor(financialYear.status)} />
        </PageHeader>

        <FinancialYearTabs
          financialYear={financialYear}
          members={members}
          report={report}
          canEdit={canEdit}
          canReopen={canReopen}
        />
      </Stack>
    );
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      notFound();
    }

    console.error(error);

    return <Alert severity="error">Failed to load financial year.</Alert>;
  }
}
