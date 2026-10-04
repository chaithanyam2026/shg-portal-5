import { ZodError, type ZodType } from "zod";

import { AppError } from "@/lib/errors";

export function parseInput<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issue = result.error instanceof ZodError ? result.error.issues[0] : undefined;
    throw new AppError(issue?.message ?? "Invalid input.", 400);
  }

  return result.data;
}
