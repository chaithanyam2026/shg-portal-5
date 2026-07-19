import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

type MeetingOtherIncomes = {
  _id: string;
  otherIncomes: {
    transactionDate: Date;
    category: string;
    amount: number;
    remarks: string;
  }[];
};

export function buildIncomeEntries(meeting: MeetingOtherIncomes): LedgerEntry[] {
  return meeting.otherIncomes.flatMap((income) => {
    if (income.amount <= 0) {
      return [];
    }

    return [
      {
        date: income.transactionDate,
        transactionType: LEDGER_TRANSACTION_TYPE.OTHER_INCOME,
        description: income.category,
        income: income.amount,
        expense: 0,
        cashInHand: 0,
        bankBalance: 0,
        meetingId: meeting._id,
      },
    ];
  });
}
