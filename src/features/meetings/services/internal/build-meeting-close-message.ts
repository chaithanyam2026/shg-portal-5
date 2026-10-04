import Meeting from "@/models/Meeting";

import { getAttendanceStatusLabel } from "../../domain/attendance-status";
import { EXPENSE_CATEGORY_OPTIONS } from "../../domain/expense";
import { INCOME_CATEGORY_OPTIONS } from "../../domain/income";
import {
  formatClosingTime,
  formatMeetingCloseDate,
  type MeetingCloseAmountLine,
  type MeetingCloseMessageContent,
} from "../../domain/whatsapp-template";
import { getBalancesAfterMeeting } from "./get-balances-after-meeting";
import { loadFinancialYearMembers } from "./load-financial-year-members";
import { loadPaymentDues } from "./load-payment-dues";

export type MeetingCloseWhatsappRecipient = {
  memberName: string;
  memberIndex: number;
  /**
   * Populated at go-live from Member.phone. Empty while sending is limited to the test number.
   */
  phone: string;
};

export type MeetingCloseWhatsappPayload = {
  meetingDate: string;
  closingTime: string;
  content: MeetingCloseMessageContent;
  recipients: MeetingCloseWhatsappRecipient[];
};

function categoryLabel(
  options: readonly { value: string; label: string }[],
  category: string,
): string {
  return options.find((option) => option.value === category)?.label ?? category;
}

function amountLines(
  records: { category: string; amount: number }[],
  options: readonly { value: string; label: string }[],
): MeetingCloseAmountLine[] {
  return records
    .filter((record) => record.amount > 0)
    .map((record) => ({
      categoryLabel: categoryLabel(options, record.category),
      amount: record.amount,
    }));
}

export async function buildMeetingCloseWhatsapp(
  meetingId: string,
): Promise<MeetingCloseWhatsappPayload | null> {
  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting || !meeting.closedAt) {
    return null;
  }

  const financialYearId = meeting.financialYearId.toString();
  const [members, dues, balances] = await Promise.all([
    loadFinancialYearMembers(financialYearId),
    loadPaymentDues(financialYearId, meetingId, meeting.meetingDate),
    getBalancesAfterMeeting(financialYearId, meetingId, meeting.meetingDate),
  ]);

  const attendanceByMemberId = new Map(
    (meeting.attendance ?? []).map((record) => [record.memberId.toString(), record.status]),
  );
  const paymentsByMemberId = new Map(
    (meeting.payments ?? []).map((payment) => [payment.memberId.toString(), payment]),
  );

  const content: MeetingCloseMessageContent = {
    members: members.map((member) => {
      const payment = paymentsByMemberId.get(member._id);
      const due = dues.get(member._id);
      const contributionPaid = payment?.contribution ?? 0;
      const absentFinePaid = payment?.absentFine ?? 0;

      return {
        name: member.name,
        attendanceLabel: getAttendanceStatusLabel(attendanceByMemberId.get(member._id) ?? ""),
        contributionPaid,
        loanRepayment: payment?.loanRepayment ?? 0,
        absentFinePaid,
        pendingContribution: Math.max(0, (due?.contributionDue ?? 0) - contributionPaid),
        pendingAbsentFine: Math.max(0, (due?.absentFineDue ?? 0) - absentFinePaid),
      };
    }),
    incomes: amountLines(meeting.otherIncomes ?? [], INCOME_CATEGORY_OPTIONS),
    expenses: amountLines(meeting.expenses ?? [], EXPENSE_CATEGORY_OPTIONS),
    cashInHand: balances.cashInHand,
    bankBalance: balances.bankBalance,
  };

  // Go-live: load each member phone and set recipient.phone.
  // Each person then receives the table image addressed to their own name.
  // import Member from "@/models/Member";
  // import { Types } from "mongoose";
  // const memberRecords = await Member.find({
  //   _id: { $in: members.map((member) => new Types.ObjectId(member._id)) },
  // })
  //   .select("phone")
  //   .lean();
  // const phoneById = new Map(
  //   memberRecords.map((member) => [member._id.toString(), member.phone]),
  // );
  const phoneById = new Map<string, string>();

  return {
    meetingDate: formatMeetingCloseDate(meeting.meetingDate),
    closingTime: formatClosingTime(meeting.closedAt),
    content,
    recipients: content.members.map((member, memberIndex) => ({
      memberName: member.name,
      memberIndex,
      phone: phoneById.get(members[memberIndex]?._id) ?? "",
    })),
  };
}
