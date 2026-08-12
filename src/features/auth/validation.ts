import { z } from "zod";

import { USER_ROLES, USER_ROLE_VALUES } from "@/lib/constants/roles";

import { USER_STATUS, USER_STATUS_VALUES } from "@/lib/constants/user-status";

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

const UsernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(50, "Username cannot exceed 50 characters.")
  .regex(/^[a-zA-Z0-9._-]+$/, "Username contains invalid characters.")
  .transform((value) => value.toLowerCase());

const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password cannot exceed 100 characters.");

export const LoginSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export const CreateUserSchema = z.object({
  username: UsernameSchema,

  password: PasswordSchema,

  role: z.enum(USER_ROLE_VALUES).default(USER_ROLES.MEMBER),

  status: z.enum(USER_STATUS_VALUES).default(USER_STATUS.ACTIVE),

  memberId: ObjectIdSchema.nullable().optional(),
});

export const UpdateUserSchema = z.object({
  username: UsernameSchema.optional(),

  role: z.enum(USER_ROLE_VALUES).optional(),

  status: z.enum(USER_STATUS_VALUES).optional(),

  memberId: ObjectIdSchema.nullable().optional(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: PasswordSchema,

    newPassword: PasswordSchema,

    confirmPassword: PasswordSchema,
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (value.currentPassword === value.newPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password must be different from current password.",
      });
    }
  });

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,

    confirmPassword: PasswordSchema,
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type LoginInput = z.infer<typeof LoginSchema>;

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
