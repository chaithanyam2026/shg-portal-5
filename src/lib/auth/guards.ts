import type { Session } from "next-auth";

import { auth } from "@/auth";
import { hasAnyRole } from "@/features/auth/authorization";
import { AppError } from "@/lib/errors";

import type { UserRole } from "./roles";

export async function requireAuth(): Promise<Session> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AppError("Unauthorized.", 401);
  }

  return session;
}

export async function requireRole(roles: readonly UserRole[]): Promise<Session> {
  const session = await requireAuth();

  if (!hasAnyRole(session, roles)) {
    throw new AppError("Forbidden.", 403);
  }

  return session;
}
