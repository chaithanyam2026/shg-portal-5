import {
  USER_ROLE_VALUES,
  type UserRole,
} from "@/lib/constants/roles";

export {
  USER_ROLES,
  USER_ROLE_VALUES,
  type UserRole,
} from "@/lib/constants/roles";

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  MEMBER: "Member",
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLE_VALUES.includes(value as UserRole);
}
