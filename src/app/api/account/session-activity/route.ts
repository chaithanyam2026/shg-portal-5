import { NextResponse } from "next/server";

import { recordSessionOpen } from "@/features/auth/services/record-login-activity";
import { requireAuth } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";

export async function POST() {
  try {
    const session = await requireAuth();
    const result = await recordSessionOpen(session.user.id, session.user.username ?? "");

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to record session activity." },
      { status: 400 },
    );
  }
}
