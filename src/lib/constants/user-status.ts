export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const USER_STATUS_VALUES = Object.values(USER_STATUS);

export type UserStatus = (typeof USER_STATUS_VALUES)[number];
