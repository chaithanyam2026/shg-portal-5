import type { UserRole } from "@/lib/auth/roles";

export type RoutePermission = {
  path: string;
  roles?: readonly UserRole[];
};

export const ROUTE_PERMISSIONS: readonly RoutePermission[] = [
  {
    path: "/",
  },
  {
    path: "/financial-years",
  },
  {
    path: "/members",
  },
  {
    path: "/meetings",
  },
  {
    path: "/loans",
  },
  {
    path: "/attendance",
  },
  {
    path: "/reports",
    roles: ["ADMIN", "TREASURER"],
  },
  {
    path: "/settings",
    roles: ["ADMIN"],
  },
] as const;

export function getAllowedRoles(pathname: string): readonly UserRole[] | undefined {
  const permission = ROUTE_PERMISSIONS.filter(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  ).sort((a, b) => b.path.length - a.path.length)[0];

  return permission?.roles;
}

export function isPublicPermission(pathname: string): boolean {
  return getAllowedRoles(pathname) === undefined;
}
