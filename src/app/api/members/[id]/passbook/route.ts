import { NextRequest, NextResponse } from "next/server";

import { getMemberPassbook } from "@/features/members/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const financialYearId = request.nextUrl.searchParams.get("financialYearId") ?? undefined;

    const passbook = await getMemberPassbook(id, financialYearId);

    return NextResponse.json(passbook);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to load member passbook.",
      },
      {
        status: 500,
      },
    );
  }
}
