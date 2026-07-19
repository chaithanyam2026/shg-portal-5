export const USER_ROLES = {
  ADMIN: "ADMIN",
  SECRETARY: "SECRETARY",
  TREASURER: "TREASURER",
  MEMBER: "MEMBER",
} as const;

export const USER_ROLE_VALUES = Object.values(USER_ROLES);

export type UserRole = (typeof USER_ROLE_VALUES)[number];
