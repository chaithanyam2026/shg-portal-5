import { NextRequest, NextResponse } from "next/server";

import { createFinancialYear, listFinancialYears } from "@/features/financial-year/services";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    const financialYears = await listFinancialYears();

    return NextResponse.json(financialYears, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to load financial years.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const financialYear = await createFinancialYear(body);

    return NextResponse.json(financialYear, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.status,
        },
      );
    }

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to create financial year.",
      },
      {
        status: 400,
      },
    );
  }
}
