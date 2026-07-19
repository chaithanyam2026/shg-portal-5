import { NextResponse } from "next/server";

import { get } from "@/features/financial-year/services/get";
import { update } from "@/features/financial-year/services/update";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectMongo();

    const { id } = await params;

    const financialYear = await get(id);

    return NextResponse.json(financialYear);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await connectMongo();

    const { id } = await params;

    const body = await request.json();

    console.log("API BODY");
    console.dir(body, { depth: null });

    const financialYear = await update(id, body);

    return NextResponse.json(financialYear);
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
