import { NextRequest, NextResponse } from "next/server";

import { createMeetingLoan } from "@/features/meetings/services/create-meeting-loan";
import { getMeetingLoans } from "@/features/meetings/services/get-meeting-loans";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const summary = await getMeetingLoans(id);

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load meeting loans.";

    return NextResponse.json(
      {
        message,
      },
      {
        status: message === "Meeting not found." ? 404 : 500,
      },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const body = await request.json();

    const loan = await createMeetingLoan(id, body);

    return NextResponse.json(loan, {
      status: 201,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create loan.";

    let status = 400;

    switch (message) {
      case "Meeting not found.":
        status = 404;
        break;

      case "Loans cannot be created after the meeting is closed.":
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
