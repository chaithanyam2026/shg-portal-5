import { NextResponse } from "next/server";

import { list } from "@/features/member/services/list";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    const members = await list();

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
