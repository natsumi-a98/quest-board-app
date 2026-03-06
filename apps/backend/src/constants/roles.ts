export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const VALID_ROLES = [ROLES.ADMIN, ROLES.USER] as const;

export type Role = (typeof VALID_ROLES)[number];
