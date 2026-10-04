import { NextRequest, NextResponse } from "next/server";

import { getLoanCloseBalances } from "@/features/loans/services";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const balances = await getLoanCloseBalances(id);

    return NextResponse.json(balances);
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
        message: error instanceof Error ? error.message : "Unable to load closing balances.",
      },
      {
        status: 400,
      },
    );
  }
}
