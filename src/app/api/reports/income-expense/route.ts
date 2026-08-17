import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  assertCanAccessFinancialStewardArea,
  assertCanAccessReportFinancialYear,
} from "@/features/financial-year/services";
import { IncomeExpenseReportSchema } from "@/features/reports/validation";

import { buildIncomeExpenseReport } from "@/features/reports/services";
import { AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    await assertCanAccessFinancialStewardArea();
    const { searchParams } = new URL(request.url);

    const input = IncomeExpenseReportSchema.parse({
      financialYearId: searchParams.get("financialYearId"),
      fromDate: searchParams.get("fromDate") ?? undefined,
      toDate: searchParams.get("toDate") ?? undefined,
    });

    await assertCanAccessReportFinancialYear(input.financialYearId);

    const report = await buildIncomeExpenseReport(input.financialYearId);

    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message,
        },
        {
          status: 400,
        },
      );
    }

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

    if (error instanceof Error && error.message === "Financial year not found.") {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 404,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}
