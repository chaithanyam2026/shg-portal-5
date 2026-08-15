import { NextRequest, NextResponse } from "next/server";

import { changePassword } from "@/features/auth/services/change-password";
import { AppError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/guards";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const result = await changePassword(session.user.id, body);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to change password." },
      { status: 400 },
    );
  }
}
