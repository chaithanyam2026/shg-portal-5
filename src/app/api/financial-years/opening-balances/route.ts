import { NextRequest, NextResponse } from "next/server";

import { generateOpeningBalances } from "@/features/financial-year/services";

export async function GET(request: NextRequest) {
  try {
    const financialYearId =
      request.nextUrl.searchParams.get("financialYearId");

    const result = await generateOpeningBalances(
      financialYearId,
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate opening balances.",
      },
      {
        status: 400,
      },
    );
  }
}
