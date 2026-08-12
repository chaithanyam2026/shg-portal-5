import { NextRequest, NextResponse } from "next/server";

import { getLoanPassbook } from "@/features/loans/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const passbook = await getLoanPassbook(id);

    return NextResponse.json(passbook);
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
