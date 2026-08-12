import { NextRequest, NextResponse } from "next/server";

import { getMemberLoans } from "@/features/members/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const financialYearId = request.nextUrl.searchParams.get("financialYearId") ?? undefined;

    const loans = await getMemberLoans(id, financialYearId);

    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to load loans.",
      },
      {
        status: 500,
      },
    );
  }
}
