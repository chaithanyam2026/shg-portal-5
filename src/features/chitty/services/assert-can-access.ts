import { requireAuth } from "@/lib/auth/guards";

export async function assertCanAccessChitty() {
  await requireAuth();
}
