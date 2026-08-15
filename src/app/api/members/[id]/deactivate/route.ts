import { NextRequest, NextResponse } from "next/server";

import { deactivateMember } from "@/features/members/services";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const member = await deactivateMember(id);

    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to deactivate member." },
      { status: 400 },
    );
  }
}
