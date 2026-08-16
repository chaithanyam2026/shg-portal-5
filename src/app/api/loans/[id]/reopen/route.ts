import { NextRequest, NextResponse } from "next/server";

import { reopenLoan } from "@/features/loans/services";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const loan = await reopenLoan(id);

    return NextResponse.json(loan);
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
        message: error instanceof Error ? error.message : "Unable to reopen loan.",
      },
      {
        status: 400,
      },
    );
  }
}
