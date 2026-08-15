/**
 * Returns the evaluation month key for a meeting repayment date.
 *
 * Each meeting evaluates the immediately preceding calendar month.
 */
export function getEvaluationKey(repaymentDate: Date): string {
  const evaluationDate = new Date(repaymentDate.getFullYear(), repaymentDate.getMonth() - 1, 1);

  return `${evaluationDate.getFullYear()}-${evaluationDate.getMonth()}`;
}

export function formatEvaluationMonthLabel(repaymentDate: Date): string {
  const evaluationDate = new Date(repaymentDate.getFullYear(), repaymentDate.getMonth() - 1, 1);

  return formatCalendarMonthLabel(evaluationDate.getFullYear(), evaluationDate.getMonth());
}

export function getCalendarMonthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function formatCalendarMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function getEvaluatedMonthForCheckpoint(checkpointDate: Date): {
  year: number;
  month: number;
} {
  const evaluatedDate = new Date(checkpointDate.getFullYear(), checkpointDate.getMonth() - 1, 1);

  return {
    year: evaluatedDate.getFullYear(),
    month: evaluatedDate.getMonth(),
  };
}

/**
 * Monthly fine checkpoints fall on the 1st of each month after disbursement.
 */
export function getMonthlyFineCheckpoints(disbursedDate: Date, endDate: Date): Date[] {
  const checkpoints: Date[] = [];

  let year = disbursedDate.getFullYear();
  let month = disbursedDate.getMonth() + 1;

  if (month > 11) {
    month = 0;
    year += 1;
  }

  while (true) {
    const checkpoint = new Date(year, month, 1);

    if (checkpoint.getTime() > endDate.getTime()) {
      break;
    }

    checkpoints.push(checkpoint);

    month += 1;

    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return checkpoints;
}
