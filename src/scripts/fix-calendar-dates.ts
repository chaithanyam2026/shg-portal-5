import path from "node:path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Meeting from "@/models/Meeting";
import Member from "@/models/Member";
import type { Types } from "mongoose";

const apply = process.argv.includes("--apply");

type DateUpdate = {
  path: string;
  from: string;
  to: string;
};

function isUtcMidnight(value: Date): boolean {
  return (
    value.getUTCHours() === 0 &&
    value.getUTCMinutes() === 0 &&
    value.getUTCSeconds() === 0 &&
    value.getUTCMilliseconds() === 0
  );
}

function normalizeCalendarDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (isUtcMidnight(date)) {
    return null;
  }

  return toCalendarDate(date);
}

function addUpdate(
  updates: DateUpdate[],
  set: Record<string, Date>,
  path: string,
  value: Date | string | null | undefined,
) {
  const next = normalizeCalendarDate(value);

  if (!next) {
    return;
  }

  const current = value instanceof Date ? value : new Date(value as string);

  updates.push({
    path,
    from: current.toISOString(),
    to: next.toISOString(),
  });
  set[path] = next;
}

async function updateCollection(
  label: string,
  collection: { updateOne(filter: object, update: object): Promise<unknown> },
  docs: Array<{ _id: Types.ObjectId }>,
  collect: (doc: (typeof docs)[number], set: Record<string, Date>, updates: DateUpdate[]) => void,
) {
  let changedDocs = 0;
  let changedFields = 0;

  for (const doc of docs) {
    const set: Record<string, Date> = {};
    const updates: DateUpdate[] = [];

    collect(doc, set, updates);

    if (updates.length === 0) {
      continue;
    }

    changedDocs += 1;
    changedFields += updates.length;

    console.log(`${label} ${doc._id.toString()}`);
    for (const update of updates) {
      console.log(`  ${update.path}: ${update.from} -> ${update.to}`);
    }

    if (apply) {
      await collection.updateOne({ _id: doc._id }, { $set: set });
    }
  }

  return { changedDocs, changedFields };
}

async function fixCalendarDates() {
  await connectMongo();

  console.log(apply ? "Applying calendar date migration..." : "Dry run (pass --apply to write).");

  const [meetings, loans, financialYears, members] = await Promise.all([
    Meeting.find()
      .select("meetingDate bankTransactions.transactionDate otherIncomes.transactionDate expenses.transactionDate")
      .exec(),
    Loan.find().select("sanctionedDate disbursedDate closedDate expiryDate").exec(),
    FinancialYear.find().select("startDate endDate members.opening.specialLoanExpiry").exec(),
    Member.find().select("joinDate").exec(),
  ]);

  const meetingResult = await updateCollection(
    "Meeting",
    Meeting.collection,
    meetings,
    (doc, set, updates) => {
      const meeting = doc as (typeof meetings)[number];

      addUpdate(updates, set, "meetingDate", meeting.meetingDate);

      meeting.bankTransactions?.forEach((item, index) => {
        addUpdate(updates, set, `bankTransactions.${index}.transactionDate`, item.transactionDate);
      });

      meeting.otherIncomes?.forEach((item, index) => {
        addUpdate(updates, set, `otherIncomes.${index}.transactionDate`, item.transactionDate);
      });

      meeting.expenses?.forEach((item, index) => {
        addUpdate(updates, set, `expenses.${index}.transactionDate`, item.transactionDate);
      });
    },
  );

  const loanResult = await updateCollection("Loan", Loan.collection, loans, (doc, set, updates) => {
    const loan = doc as (typeof loans)[number];

    addUpdate(updates, set, "sanctionedDate", loan.sanctionedDate);
    addUpdate(updates, set, "disbursedDate", loan.disbursedDate);
    addUpdate(updates, set, "closedDate", loan.closedDate);
    addUpdate(updates, set, "expiryDate", loan.expiryDate);
  });

  const financialYearResult = await updateCollection(
    "FinancialYear",
    FinancialYear.collection,
    financialYears,
    (doc, set, updates) => {
      const financialYear = doc as (typeof financialYears)[number];

      addUpdate(updates, set, "startDate", financialYear.startDate);
      addUpdate(updates, set, "endDate", financialYear.endDate);

      financialYear.members?.forEach((member, index) => {
        addUpdate(
          updates,
          set,
          `members.${index}.opening.specialLoanExpiry`,
          member.opening?.specialLoanExpiry,
        );
      });
    },
  );

  const memberResult = await updateCollection(
    "Member",
    Member.collection,
    members,
    (doc, set, updates) => {
      const member = doc as (typeof members)[number];

      addUpdate(updates, set, "joinDate", member.joinDate);
    },
  );

  const totals = [meetingResult, loanResult, financialYearResult, memberResult].reduce(
    (sum, result) => ({
      changedDocs: sum.changedDocs + result.changedDocs,
      changedFields: sum.changedFields + result.changedFields,
    }),
    { changedDocs: 0, changedFields: 0 },
  );

  console.log(
    `\n${apply ? "Updated" : "Would update"} ${totals.changedFields} date field(s) across ${totals.changedDocs} document(s).`,
  );

  if (!apply && totals.changedFields > 0) {
    console.log("Re-run with --apply to write these changes:");
    console.log("  npm run fix:calendar-dates -- --apply");
  }

  process.exit(0);
}

fixCalendarDates().catch((error) => {
  console.error(error);
  process.exit(1);
});
