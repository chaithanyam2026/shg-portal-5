import { NextRequest, NextResponse } from "next/server";

import { getMeeting } from "@/features/meetings/services/get";
import { updateMeeting } from "@/features/meetings/services/update";

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

    const meeting = await getMeeting(id);

    return NextResponse.json(meeting);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load meeting.",
      },
      {
        status:
          error instanceof Error &&
          error.message === "Meeting not found."
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
    console.log("\n\n\nPATCH /api/meetings/[id] HIT");
  try {
    const { id } = await params;

    const body = await request.json();


    const meeting = await updateMeeting(
      id,
      body,
      null,
    );

    return NextResponse.json(meeting);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update meeting.";

    let status = 400;

    if (message === "Meeting not found.") {
      status = 404;
    } else if (
      message === "Financial year not found."
    ) {
      status = 404;
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