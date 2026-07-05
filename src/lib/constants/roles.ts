export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  GUEST: 'GUEST',
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
* Array of valid role values.
* Used by Mongoose enum validation.
*/
export const USER_ROLE_VALUES: UserRole[] = Object.values(
  USER_ROLES,
);