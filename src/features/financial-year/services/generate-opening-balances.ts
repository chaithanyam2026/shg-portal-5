import connectMongo from "@/lib/db/mongodb";
import Member from "@/models/Member";
import FinancialYear from "@/models/FinancialYear";

import type { OpeningBalanceResult } from "../domain/opening-balance-result";
import { buildOpeningBalances } from "./internal";
import { validateOpeningBalanceSource } from "./internal";
import { buildComputedClosingSnapshot } from "./internal/build-computed-closing-snapshot";
import { enrichMemberOpeningBalances } from "./internal/enrich-member-opening-balances";

export type { OpeningBalanceResult };

export async function generateOpeningBalances(
  sourceFinancialYearId: string | null,
): Promise<OpeningBalanceResult> {
  await connectMongo();

  if (!sourceFinancialYearId) {
    const members = await Member.find(
      {},
      {
        memberCode: 1,
        name: 1,
      },
    )
      .sort({ memberCode: 1 })
      .lean();

    const empty = buildOpeningBalances(null);

    return {
      ...empty,
      summary: {
        ...empty.summary,
        members: members.map((member) => ({
          memberId: member._id.toString(),
          memberCode: member.memberCode,
          memberName: member.name,
          savings: 0,
          loanOutstanding: 0,
          fineOutstanding: 0,
          shareCapital: 0,
          interestReceivable: 0,
        })),
      },
    };
  }

  const sourceFinancialYear = await FinancialYear.findById(sourceFinancialYearId).populate({
    path: "members.memberId",
    select: "memberCode name",
  });

  if (!sourceFinancialYear) {
    throw new Error("Source financial year not found.");
  }

  await validateOpeningBalanceSource(sourceFinancialYearId);

  const closingSnapshot =
    sourceFinancialYear.status === "CLOSED" && sourceFinancialYear.closing
      ? sourceFinancialYear.closing
      : await buildComputedClosingSnapshot(sourceFinancialYearId);

  const opening = buildOpeningBalances(closingSnapshot);
  const members = await enrichMemberOpeningBalances(
    opening.summary.members,
    sourceFinancialYear,
  );

  return {
    ...opening,
    summary: {
      ...opening.summary,
      members,
    },
  };
}
