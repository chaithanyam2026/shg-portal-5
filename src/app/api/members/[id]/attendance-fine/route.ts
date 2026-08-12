import { NextRequest, NextResponse } from "next/server";

import { getAttendanceFineSummary } from "@/features/members/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const financialYearId = request.nextUrl.searchParams.get("financialYearId") ?? undefined;

    const attendanceFine = await getAttendanceFineSummary(id, financialYearId);

    return NextResponse.json(attendanceFine);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to load attendance fine.",
      },
      {
        status: 500,
      },
    );
  }
}
