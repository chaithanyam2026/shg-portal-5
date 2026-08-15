import { NextRequest, NextResponse } from "next/server";

import { getMemberTransactions } from "@/features/meetings/services/get-member-transactions";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const summary = await getMemberTransactions(id);

    return NextResponse.json(summary);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load member transactions.";

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
