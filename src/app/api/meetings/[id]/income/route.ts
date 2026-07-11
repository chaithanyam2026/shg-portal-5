import { NextRequest, NextResponse } from "next/server";

import { getIncome } from "@/features/meetings/services/get-income";
import { updateIncome } from "@/features/meetings/services/income";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const summary =
      await getIncome(id);

    return NextResponse.json(
      summary,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load income.";

    return NextResponse.json(
      {
        message,
      },
      {
        status:
          message ===
          "Meeting not found."
            ? 404
            : 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const body =
      await request.json();

    const result =
      await updateIncome(
        id,
        body,
      );

    return NextResponse.json(
      result,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update income.";

    let status = 400;

    switch (message) {
      case "Meeting not found.":
        status = 404;
        break;

      case "Income cannot be updated after the meeting is closed.":
        status = 409;
        break;
    }

    return NextResponse.json(
      {
        message,
      },
      {
        status,
      },
    );
  }
}