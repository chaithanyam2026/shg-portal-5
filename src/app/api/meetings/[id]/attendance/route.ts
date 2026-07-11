import { NextRequest, NextResponse } from "next/server";

import { getAttendance } from "@/features/meetings/services/get-attendance";
import { updateAttendance } from "@/features/meetings/services/attendance";

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

    const attendance = await getAttendance(id);

    return NextResponse.json(attendance);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load attendance.";

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
      await updateAttendance(
        id,
        body,
      );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update attendance.";

    let status = 400;

    switch (message) {
      case "Meeting not found.":
        status = 404;
        break;

      case "Attendance cannot be updated after the meeting is closed.":
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