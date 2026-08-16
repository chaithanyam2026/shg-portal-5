import {
  USER_ROLES,
  USER_ROLE_VALUES,
  type UserRole,
} from "@/lib/constants/roles";

export {
  USER_ROLES,
  USER_ROLE_VALUES,
  type UserRole,
} from "@/lib/constants/roles";

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  MEMBER: "Member",
};

export const ADMIN_ROLES = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN] as const;

export function isAdminRole(role?: string | null): boolean {
  return role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.ADMIN;
}

export function canResetUserPassword(actorRole?: string | null, targetRole?: string | null): boolean {
  return isAdminRole(actorRole) && !isAdminRole(targetRole);
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLE_VALUES.includes(value as UserRole);
}
