/**
 * User account lifecycle.
 */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
} as const;

export type UserStatus =
  (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_VALUES =
  Object.values(USER_STATUS);
