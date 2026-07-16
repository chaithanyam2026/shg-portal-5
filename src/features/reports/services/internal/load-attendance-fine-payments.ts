import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

export type AttendanceFinePayment = {
  meetingId: string;

  meetingDate: Date;

  memberId: string;

  finePaid: number;
};

/**
 * Loads attendance fine payments
 * for a financial year.
 *
 * Returns one record per member
 * per meeting where an attendance
 * fine payment exists.
 */
export async function loadAttendanceFinePayments(
  financialYearId: string,
): Promise<
  AttendanceFinePayment[]
> {
  await connectMongo();

  const meetings =
    await Meeting.find({
      financialYearId,
      status: "CLOSED",
    })
      .sort({
        meetingDate: 1,
      })
      .lean();

  const payments: AttendanceFinePayment[] =
    [];

  for (const meeting of meetings) {
    const meetingPayments =
      meeting.payments ?? [];

    for (const payment of meetingPayments) {
      payments.push({
        meetingId:
          meeting._id.toString(),

        meetingDate:
          meeting.meetingDate,

        memberId:
          payment.memberId.toString(),

        finePaid:
          payment.attendanceFine ??
          0,
      });
    }
  }

  return payments;
}