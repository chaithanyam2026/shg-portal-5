"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginInput, LoginSchema } from "@/features/auth/validation";

export type LoginActionState = {
  success: boolean;
  error: string | null;
};

export async function loginAction(input: LoginInput): Promise<LoginActionState> {
  const data = LoginSchema.parse(input);

  try {
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid username or password.",
          };

        default:
          return {
            success: false,
            error: "Authentication failed.",
          };
      }
    }

    throw error;
  }
}
