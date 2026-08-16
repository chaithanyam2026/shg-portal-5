import { NextRequest, NextResponse } from "next/server";

import { reopenMeeting } from "@/features/meetings/services/reopen";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const meeting = await reopenMeeting(id);

    return NextResponse.json(meeting);
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

    const message = error instanceof Error ? error.message : "Unable to reopen meeting.";

    return NextResponse.json(
      { message },
      {
        status: message === "Meeting not found." ? 404 : 400,
      },
    );
  }
}
