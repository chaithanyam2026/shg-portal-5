import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import {
  isOpeningAccountLedgerEntry,
  isOpeningMemberLedgerEntry,
  LEDGER_TRANSACTION_TYPE,
} from "@/features/reports/domain/transaction-type";
import type { RunningBalance } from "@/features/reports/types";

function setEntryBalances(
  entry: LedgerEntry,
  cashInHand: number,
  bankBalance: number,
  cashInHandHidden: boolean,
): void {
  entry.cashInHand = cashInHand;
  entry.bankBalance = bankBalance;
  entry.cashInHandHidden = cashInHandHidden;
}

export function calculateRunningBalances(
  entries: LedgerEntry[],
  openingCash: number,
  openingBank: number,
): RunningBalance {
  let cashInHand = openingCash;
  let bankBalance = openingBank;
  let cashInHandInitialized = openingCash > 0;

  for (const entry of entries) {
    if (entry.transactionType === LEDGER_TRANSACTION_TYPE.OPENING_CASH_IN_HAND) {
      cashInHand = entry.expense;
      cashInHandInitialized = true;
      setEntryBalances(entry, cashInHand, bankBalance, false);
      continue;
    }

    if (entry.isSummary || isOpeningAccountLedgerEntry(entry.transactionType)) {
      setEntryBalances(entry, cashInHand, bankBalance, !cashInHandInitialized);
      continue;
    }

    if (isOpeningMemberLedgerEntry(entry.transactionType)) {
      setEntryBalances(entry, cashInHand, bankBalance, !cashInHandInitialized);
      continue;
    }

    if (entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT) {
      cashInHand -= entry.expense;
      bankBalance += entry.expense;
    } else if (entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL) {
      bankBalance -= entry.income;
      cashInHand += entry.income;
    } else if (
      entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_INTEREST ||
      entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT_MATURITY
    ) {
      bankBalance += entry.income;
    } else if (
      entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT ||
      entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_CHARGE
    ) {
      bankBalance -= entry.expense;
    } else {
      cashInHand += entry.income;
      cashInHand -= entry.expense;
    }

    setEntryBalances(entry, cashInHand, bankBalance, !cashInHandInitialized);
  }

  return {
    cashInHand,
    bankBalance,
  };
}
