import { NextRequest, NextResponse } from "next/server";

import { updateChitty } from "@/features/chitty/services";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const scheme = await updateChitty(id, body);
    return NextResponse.json(scheme);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update chitty." },
      { status: 400 },
    );
  }
}
