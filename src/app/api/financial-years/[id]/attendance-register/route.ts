import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getAttendanceRegister,
} from "@/features/reports/services";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Returns the consolidated
 * attendance register.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const register =
      await getAttendanceRegister(
        id,
      );

    return NextResponse.json(
      register,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load attendance register.",
      },
      {
        status: 500,
      },
    );
  }
}