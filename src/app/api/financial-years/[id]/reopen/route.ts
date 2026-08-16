import { NextRequest, NextResponse } from "next/server";

import { reopenFinancialYear } from "@/features/financial-year/services/reopen";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const financialYear = await reopenFinancialYear(id);

    return NextResponse.json(financialYear);
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
        message: error instanceof Error ? error.message : "Unable to reopen financial year.",
      },
      {
        status: 400,
      },
    );
  }
}
