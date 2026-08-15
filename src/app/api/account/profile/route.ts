import { NextRequest, NextResponse } from "next/server";

import { getAccountProfile } from "@/features/members/services/get-account-profile";
import { updateAccountProfile } from "@/features/members/services/update-account-profile";
import { AppError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/guards";

export async function GET() {
  try {
    const session = await requireAuth();
    const profile = await getAccountProfile(session.user.id);

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load profile." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const result = await updateAccountProfile(session.user.id, body);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update profile." },
      { status: 400 },
    );
  }
}
