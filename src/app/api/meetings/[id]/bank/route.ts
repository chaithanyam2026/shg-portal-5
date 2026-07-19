import { NextRequest, NextResponse } from "next/server";

import { updateBankTransactions } from "@/features/meetings/services/bank-transactions";
import { getBankTransactions } from "@/features/meetings/services/get-bank-transactions";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const summary = await getBankTransactions(id);

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load bank transactions.";

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

    const result = await updateBankTransactions(id, body);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update bank transactions.";

    let status = 400;

    switch (message) {
      case "Meeting not found.":
        status = 404;
        break;

      case "Bank transactions cannot be updated after the meeting is closed.":
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
