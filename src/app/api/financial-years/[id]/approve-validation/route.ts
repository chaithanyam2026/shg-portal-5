import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

import { getFinancialYearApproveValidation } from "@/features/financial-year/services/approve";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const validation = await getFinancialYearApproveValidation(id);

    return NextResponse.json(validation);
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
        message: error instanceof Error ? error.message : "Unable to load approval validation.",
      },
      {
        status: 400,
      },
    );
  }
}
