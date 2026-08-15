import type { UserRole } from "@/lib/auth/roles";

export type ApiPermission = {
  path: string;
  roles: readonly UserRole[];
};

export const API_PERMISSIONS: readonly ApiPermission[] = [
  {
    path: "/api/reports",
    roles: ["ADMIN", "TREASURER"],
  },
  {
    path: "/api/users",
    roles: ["ADMIN"],
  },
] as const;

export function getAllowedApiRoles(pathname: string): readonly UserRole[] | undefined {
  const permission = API_PERMISSIONS.filter(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  ).sort((a, b) => b.path.length - a.path.length)[0];

  return permission?.roles;
}

export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

export function isPublicApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/auth");
}
