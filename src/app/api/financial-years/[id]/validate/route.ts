import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

import { markFinancialYearValidated } from "@/features/financial-year/services/mark-validated";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
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

    const result = await markFinancialYearValidated(id);

    return NextResponse.json(result);
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
        message: error instanceof Error ? error.message : "Unable to validate financial year.",
      },
      {
        status: 400,
      },
    );
  }
}
