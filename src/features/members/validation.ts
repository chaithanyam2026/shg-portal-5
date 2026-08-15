import { z } from "zod";

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

export const CreateMemberSchema = z.object({
  memberCode: z
    .string()
    .trim()
    .min(1, "Member code is required.")
    .max(20, "Member code cannot exceed 20 characters.")
    .transform((value) => value.toUpperCase()),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name cannot exceed 150 characters."),

  phone: z
    .string()
    .trim()
    .min(10, "Phone must be at least 10 digits.")
    .max(15, "Phone cannot exceed 15 digits."),

  address: z.string().trim().max(500, "Address cannot exceed 500 characters.").optional().default(""),

  joinDate: z.coerce.date(),

  remarks: z.string().trim().max(1000, "Remarks cannot exceed 1000 characters.").optional().default(""),

  username: UsernameSchema,

  password: PasswordSchema,
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
