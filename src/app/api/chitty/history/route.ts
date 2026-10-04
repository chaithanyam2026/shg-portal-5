import { NextRequest, NextResponse } from "next/server";

import { getChittyHistory } from "@/features/chitty/services";
import { AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const chittyId = request.nextUrl.searchParams.get("chittyId") ?? "";
    const rows = await getChittyHistory(chittyId);
    return NextResponse.json(rows);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load chitty history." },
      { status: 500 },
    );
  }
}
