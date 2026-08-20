import { NextRequest, NextResponse } from "next/server";

import { getChittyPayments, saveChittyPayments } from "@/features/chitty/services";
import { SaveChittyPaymentsSchema } from "@/features/chitty/validation";
import { requireAuth } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") ?? undefined;
    const sheet = await getChittyPayments(date);
    return NextResponse.json(sheet);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load chitty payments." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = SaveChittyPaymentsSchema.parse(body);
    const sheet = await saveChittyPayments({
      ...data,
      userId: session.user.id,
    });
    return NextResponse.json(sheet);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to save chitty payments." },
      { status: 400 },
    );
  }
}
