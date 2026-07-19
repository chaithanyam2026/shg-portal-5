import { NextRequest, NextResponse } from "next/server";

import { generateOpeningBalances } from "@/features/financial-year/services";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("financialYearId");

    if (!id) {
      return NextResponse.json(
        {
          message: "Financial year id is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await generateOpeningBalances(id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to generate opening balances.",
      },
      {
        status: 400,
      },
    );
  }
}
