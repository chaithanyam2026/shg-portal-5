import { NextRequest, NextResponse } from "next/server";

import { createChitty, listChittySchemes } from "@/features/chitty/services";
import { requireAuth } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    const schemes = await listChittySchemes();
    return NextResponse.json(schemes);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load chitties." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const scheme = await createChitty(body, session.user.id);
    return NextResponse.json(scheme, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create chitty." },
      { status: 400 },
    );
  }
}
