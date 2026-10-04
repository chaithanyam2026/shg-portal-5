import { NextRequest, NextResponse } from "next/server";

import { getChittyUserHistory } from "@/features/chitty/services";
import { AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const chittyId = request.nextUrl.searchParams.get("chittyId") ?? "";
    const history = await getChittyUserHistory(chittyId);
    return NextResponse.json(history);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load chitty user history." },
      { status: 500 },
    );
  }
}
