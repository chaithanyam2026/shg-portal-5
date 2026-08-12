import { NextRequest, NextResponse } from "next/server";

import { startMeeting } from "@/features/meetings/services/start";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const meeting = await startMeeting(id, null);

    return NextResponse.json(meeting);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start meeting.";

    const status = message === "Meeting not found." ? 404 : 400;

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
