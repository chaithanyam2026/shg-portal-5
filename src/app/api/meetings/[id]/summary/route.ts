import { NextRequest, NextResponse } from "next/server";

import { getSummary } from "@/features/meetings/services/get-summary";

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
      await getSummary(id);

    return NextResponse.json(
      summary,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load meeting summary.";

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