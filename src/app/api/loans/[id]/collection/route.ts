import { NextRequest, NextResponse } from "next/server";

import { recordLoanCollection } from "@/features/loans/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const body = await request.json();

    const result = await recordLoanCollection(id, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}
