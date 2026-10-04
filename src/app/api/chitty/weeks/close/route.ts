import { NextRequest, NextResponse } from "next/server";

import { closeChittyWeek } from "@/features/chitty/services";
import { requireAuth } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const sheet = await closeChittyWeek(body, session.user.id);
    return NextResponse.json(sheet);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to close this Sunday." },
      { status: 400 },
    );
  }
}
