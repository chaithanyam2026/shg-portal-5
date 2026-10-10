/**
 * Opening used for expected contribution: the highest non-zero member opening.
 * Members with a zero opening are ignored so they follow the group standard.
 */
export function standardOpeningContribution(openingAmounts: number[]): number {
  let maximum = 0;

  for (const amount of openingAmounts) {
    if (amount > maximum) {
      maximum = amount;
    }
  }

  return maximum;
}

export function expectedContributionAmount(
  openingContribution: number,
  closedMeetingCount: number,
  weeklyContribution: number,
): number {
  return openingContribution + closedMeetingCount * weeklyContribution;
}

export function contributionToBePaid(expectedAmount: number, paidAmount: number): number {
  return Math.max(0, expectedAmount - paidAmount);
}
