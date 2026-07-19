import { NextRequest } from "next/server";

import { auth } from "@/auth";

import { closeFinancialYear } from "@/features/financial-year/services";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: NextRequest, { params }: Context) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const result = await closeFinancialYear(id, session.user.id);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Unable to close financial year.",
      },
      {
        status: 400,
      },
    );
  }
}
