import type { Session } from "next-auth";

import type { UserRole } from "@/lib/auth/roles";

export function isAuthenticated(session: Session | null): session is Session {
  return session !== null;
}

export function hasRole(session: Session | null, role: UserRole): boolean {
  return session?.user.role === role;
}

export function hasAnyRole(session: Session | null, roles: readonly UserRole[]): boolean {
  if (!session) {
    return false;
  }

  return roles.includes(session.user.role as UserRole);
}

export function canAccessRoute(
  session: Session | null,
  allowedRoles?: readonly UserRole[],
): boolean {
  if (!isAuthenticated(session)) {
    return false;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return hasAnyRole(session, allowedRoles);
}
