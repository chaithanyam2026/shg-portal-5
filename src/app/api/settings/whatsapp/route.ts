import { NextRequest, NextResponse } from "next/server";

import { getWhatsappSettings, updateWhatsappSettings } from "@/features/settings/services";
import { AppError } from "@/lib/errors";
import { ZodError } from "zod";

export async function GET() {
  try {
    const settings = await getWhatsappSettings();
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Unable to load WhatsApp settings." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await updateWhatsappSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid WhatsApp settings." }, { status: 400 });
    }

    return NextResponse.json({ message: "Unable to update WhatsApp settings." }, { status: 400 });
  }
}
