export const LOGIN_ACTIVITY_TYPE = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  SESSION_OPEN: "SESSION_OPEN",
} as const;

export const LOGIN_ACTIVITY_TYPE_VALUES = [
  LOGIN_ACTIVITY_TYPE.LOGIN_SUCCESS,
  LOGIN_ACTIVITY_TYPE.LOGIN_FAILURE,
  LOGIN_ACTIVITY_TYPE.SESSION_OPEN,
] as const;

export type LoginActivityType = (typeof LOGIN_ACTIVITY_TYPE_VALUES)[number];

export const LOGIN_ACTIVITY_TYPE_LABELS: Record<LoginActivityType, string> = {
  LOGIN_SUCCESS: "Login success",
  LOGIN_FAILURE: "Login failed",
  SESSION_OPEN: "App opened",
};

/** Ignore repeat PWA/session opens within this window. */
export const SESSION_OPEN_COOLDOWN_MS = 30 * 60 * 1000;
