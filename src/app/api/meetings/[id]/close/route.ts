import { NextRequest, NextResponse } from "next/server";

import { closeMeeting } from "@/features/meetings/services/close";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const meeting = await closeMeeting(
      id,
      null,
    );

    return NextResponse.json(meeting);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to close meeting.";

    return NextResponse.json(
      { message },
      {
        status:
          message === "Meeting not found."
            ? 404
            : 400,
      },
    );
  }
}