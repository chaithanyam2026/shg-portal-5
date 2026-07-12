import Meeting from "@/models/Meeting";

export type LoanRepayment = {
  meetingId: string;

  meetingDate: Date;

  amountPaid: number;
};

type LoadLoanRepaymentsInput = {
  memberId: unknown;
};

/**
 * Loads all loan repayments for a member.
 *
 * Repayments are returned in meeting
 * date order.
 */
export async function loadLoanRepayments({
  memberId,
}: LoadLoanRepaymentsInput): Promise<
  LoanRepayment[]
> {
  const meetings =
    await Meeting.find({
      "payments.memberId":
        memberId,
    })
      .select({
        meetingDate: 1,
        payments: 1,
      })
      .sort({
        meetingDate: 1,
      })
      .lean();

  const repayments:
    LoanRepayment[] = [];

  for (const meeting of meetings) {
    const payment =
      meeting.payments.find(
        (item) =>
          item.memberId.toString() ===
          memberId.toString(),
      );

    if (
      !payment ||
      payment.loanRepayment <= 0
    ) {
      continue;
    }

    repayments.push({
      meetingId:
        meeting._id.toString(),

      meetingDate:
        meeting.meetingDate,

      amountPaid:
        payment.loanRepayment,
    });
  }

  return repayments;
}