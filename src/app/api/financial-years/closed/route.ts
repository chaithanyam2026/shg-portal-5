import { NextResponse } from "next/server";

import { listClosedFinancialYears } from "@/features/financial-year/services/list-closed";

export async function GET() {
  try {
    const financialYears = await listClosedFinancialYears();

    return NextResponse.json(financialYears);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to load financial years.",
      },
      {
        status: 500,
      },
    );
  }
}
