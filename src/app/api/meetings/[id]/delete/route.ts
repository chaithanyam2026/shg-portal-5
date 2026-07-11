import { NextRequest, NextResponse } from "next/server";

import { deleteMeeting } from "@/features/meetings/services/delete";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await deleteMeeting(id);

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete meeting.";

    return NextResponse.json(
      {
        message,
      },
      {
        status:
          message === "Meeting not found."
            ? 404
            : 400,
      },
    );
  }
}