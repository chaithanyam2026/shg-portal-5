import { NextRequest, NextResponse } from "next/server";

import { create } from "@/features/financial-year/services/create";
import { list } from "@/features/financial-year/services/list";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    await connectMongo();

    const financialYears = await list();

    return NextResponse.json(financialYears);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();

    const financialYear = await create(body);

    return NextResponse.json(financialYear, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}