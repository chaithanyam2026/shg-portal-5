import { NextRequest, NextResponse } from "next/server";

import { createMember, listMembers } from "@/features/members/services";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    const members = await listMembers();

    return NextResponse.json(members);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.status,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const member = await createMember(body);

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create member." },
      { status: 400 },
    );
  }
}
