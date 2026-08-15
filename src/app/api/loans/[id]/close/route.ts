import { NextRequest, NextResponse } from "next/server";

import { closeLoan } from "@/features/loans/services";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const loan = await closeLoan(id, body);

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
        message: error instanceof Error ? error.message : "Unable to close loan.",
      },
      {
        status: 400,
      },
    );
  }
}
