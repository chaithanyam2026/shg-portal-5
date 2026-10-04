export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function collectedAmount(cash: number, gpay: number): number {
  return roundMoney(cash + gpay);
}

export type ChittyWeekAmounts = {
  date: string;
  collected: number;
  disbursedAmount: number;
  closed: boolean;
};

export type ChittyWeekBalance = ChittyWeekAmounts & {
  previousPending: number;
  collection: number;
  balance: number;
};

export function buildWeekBalanceChain(weeks: ChittyWeekAmounts[]): ChittyWeekBalance[] {
  let previousPending = 0;

  return weeks.map((week) => {
    const collected = roundMoney(week.collected);
    const disbursedAmount = roundMoney(week.disbursedAmount);
    const collection = roundMoney(collected + previousPending);
    const balance = roundMoney(collection - disbursedAmount);
    const row: ChittyWeekBalance = {
      ...week,
      collected,
      disbursedAmount,
      previousPending,
      collection,
      balance,
    };

    previousPending = balance;
    return row;
  });
}
