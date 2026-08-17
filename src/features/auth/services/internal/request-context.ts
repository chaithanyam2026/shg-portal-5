import { headers } from "next/headers";

export type LoginActivityRequestContext = {
  ipAddress: string;
  userAgent: string;
};

export async function getLoginActivityRequestContext(): Promise<LoginActivityRequestContext> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "";
    const userAgent = headerList.get("user-agent") ?? "";

    return {
      ipAddress,
      userAgent: userAgent.slice(0, 500),
    };
  } catch {
    return {
      ipAddress: "",
      userAgent: "",
    };
  }
}
