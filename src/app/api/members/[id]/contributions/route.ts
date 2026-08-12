import { NextRequest, NextResponse } from "next/server";

import { getMemberContributionPayments } from "@/features/members/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const financialYearId = request.nextUrl.searchParams.get("financialYearId");

    if (!financialYearId) {
      return NextResponse.json(
        {
          message: "financialYearId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const contributions = await getMemberContributionPayments(id, financialYearId);

    return NextResponse.json(contributions);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to load contribution payments.",
      },
      {
        status: 500,
      },
    );
  }
}
