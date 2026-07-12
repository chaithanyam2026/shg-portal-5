import { NextRequest, NextResponse } from "next/server";

import {
  createLoan,
  listLoans,
} from "@/features/loans/services";


export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const loans =
      await listLoans({
        financialYearId:
          searchParams.get(
            "financialYearId",
          ) ?? undefined,

        memberId:
          searchParams.get(
            "memberId",
          ) ?? undefined,

        status:
          searchParams.get(
            "status",
          ) ?? undefined,
      });

    return NextResponse.json(
      loans,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch loans.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const loan =
      await createLoan(
        body,
      );

    return NextResponse.json(
      loan,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error
    ) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}