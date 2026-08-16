import { canCurrentUserAccessFinancialStewardArea } from "@/features/financial-year/services/assert-can-access-steward-area";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { AppError } from "@/lib/errors";

export async function canCurrentUserViewAllLoans(): Promise<boolean> {
  return canCurrentUserAccessFinancialStewardArea();
}

export async function assertCanViewLoan(loanMemberId: string): Promise<void> {
  if (await canCurrentUserViewAllLoans()) {
    return;
  }

  const memberId = await getCurrentMemberId();

  if (memberId && memberId === loanMemberId) {
    return;
  }

  throw new AppError("Loan not found.", 404);
}
