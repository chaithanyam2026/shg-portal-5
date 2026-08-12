import { NextRequest, NextResponse } from "next/server";

import { getLoan, updateLoan } from "@/features/loans/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const loan = await getLoan(id);

    return NextResponse.json(loan);
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

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;

    const body = await request.json();

    const loan = await updateLoan(id, body);

    return NextResponse.json(loan);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to update loan.",
      },
      {
        status: 400,
      },
    );
  }
}
