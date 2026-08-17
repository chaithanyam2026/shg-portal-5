import { NextRequest, NextResponse } from "next/server";

import { listLoginActivity } from "@/features/auth/services";
import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    const activity = await listLoginActivity(id);

    return NextResponse.json(activity);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load login activity." },
      { status: 400 },
    );
  }
}
