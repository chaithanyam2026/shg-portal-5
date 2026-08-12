import { NextRequest, NextResponse } from "next/server";

import { createMeeting } from "@/features/meetings/services/create";
import { listMeetings } from "@/features/meetings/services/list";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? "1");

    const pageSize = Number(searchParams.get("pageSize") ?? "20");

    const search = searchParams.get("search") ?? undefined;

    const status = searchParams.get("status") ?? undefined;

    const financialYearId = searchParams.get("financialYearId") ?? undefined;

    const sort = searchParams.get("sort") ?? "meetingDate";

    const result = await listMeetings({
      page,
      pageSize,
      search,
      status: status as "DRAFT" | "IN_PROGRESS" | "APPROVED" | "CLOSED" | undefined,
      financialYearId,
      sort: sort === "-meetingDate" ? "-meetingDate" : "meetingDate",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load meetings.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const meeting = await createMeeting(body, null);

    return NextResponse.json(meeting, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to create meeting.",
      },
      {
        status: 400,
      },
    );
  }
}
