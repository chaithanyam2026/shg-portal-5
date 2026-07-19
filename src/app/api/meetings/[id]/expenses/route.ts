import { NextRequest, NextResponse } from "next/server";

import { updateExpenses } from "@/features/meetings/services/expenses";
import { getExpenses } from "@/features/meetings/services/get-expenses";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const summary = await getExpenses(id);

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load expenses.";

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

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const body = await request.json();

    const result = await updateExpenses(id, body);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update expenses.";

    let status = 400;

    switch (message) {
      case "Meeting not found.":
        status = 404;
        break;

      case "Expenses cannot be updated after the meeting is closed.":
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
