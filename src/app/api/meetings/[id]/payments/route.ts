import { NextRequest, NextResponse } from "next/server";

import { getPayments } from "@/features/meetings/services/get-payments";
import { updatePayments } from "@/features/meetings/services/payments";

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

    const payments =
      await getPayments(id);

    return NextResponse.json(payments);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load payments.";

    return NextResponse.json(
      {
        message,
      },
      {
        status:
          message === "Meeting not found."
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

    const body = await request.json();

    const result =
      await updatePayments(
        id,
        body,
      );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update payments.";

    let status = 400;

    switch (message) {
      case "Meeting not found.":
        status = 404;
        break;

      case "Payments cannot be updated after the meeting is closed.":
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