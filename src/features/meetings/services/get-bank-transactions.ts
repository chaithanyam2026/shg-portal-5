import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import {
  BANK_TRANSACTION_TYPE,
} from "../domain/bank-transaction";

import type {
  BankTransactionRecord,
  BankTransactionSummary,
} from "../types";

function createSummary(
  meetingId: string,
  status: BankTransactionSummary["status"],
  records: BankTransactionRecord[],
): BankTransactionSummary {
  const totalDeposits = records
    .filter(
      (record) =>
        record.type ===
          BANK_TRANSACTION_TYPE.DEPOSIT ||
        record.type ===
          BANK_TRANSACTION_TYPE.INTEREST ||
        record.type ===
          BANK_TRANSACTION_TYPE.INVESTMENT_MATURITY,
    )
    .reduce(
      (sum, record) =>
        sum + record.amount,
      0,
    );

  const totalWithdrawals = records
    .filter(
      (record) =>
        record.type ===
          BANK_TRANSACTION_TYPE.WITHDRAWAL ||
        record.type ===
          BANK_TRANSACTION_TYPE.INVESTMENT ||
        record.type ===
          BANK_TRANSACTION_TYPE.BANK_CHARGE,
    )
    .reduce(
      (sum, record) =>
        sum + record.amount,
      0,
    );

  return {
    meetingId,

    status,

    records,

    totalDeposits,

    totalWithdrawals,

    netAmount:
      totalDeposits -
      totalWithdrawals,
  };
}

export async function getBankTransactions(
  meetingId: string,
): Promise<BankTransactionSummary> {
  await connectMongo();

  const meeting =
    await Meeting.findById(
      meetingId,
    ).lean();

  if (!meeting) {
    throw new Error(
      "Meeting not found.",
    );
  }

  const records: BankTransactionRecord[] =
    (meeting.bankTransactions ??
      []).map((transaction) => ({
      transactionDate:
        transaction.transactionDate.toISOString(),

      type: transaction.type,

      amount:
        transaction.amount,

      remarks:
        transaction.remarks,
    }));

  return createSummary(
    meetingId,
    meeting.status,
    records,
  );
}