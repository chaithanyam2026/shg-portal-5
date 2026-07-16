import type {
  AttendanceFineEntry,
} from "../../domain";

export type CalculatePendingAttendanceFineInput =
  {
    entries: AttendanceFineEntry[];
  };

export type CalculatePendingAttendanceFineResult =
  {
    totalFine: number;

    paidFine: number;

    pendingFine: number;

    entries: AttendanceFineEntry[];
  };

/**
 * Calculates running attendance
 * fine balances.
 *
 * Business Rules
 * --------------
 * - Generated fine accumulates.
 * - Paid fine accumulates.
 * - Pending fine can never
 *   become negative.
 */
export function calculatePendingAttendanceFine({
  entries,
}: CalculatePendingAttendanceFineInput): CalculatePendingAttendanceFineResult {
  let totalFine = 0;

  let paidFine = 0;

  let pendingFine = 0;

  const updatedEntries =
    entries.map((entry) => {
      totalFine +=
        entry.fineCharged;

      paidFine +=
        entry.finePaid;

      pendingFine =
        Math.max(
          0,
          totalFine - paidFine,
        );

      return {
        ...entry,

        pendingFine,
      };
    });

  return {
    totalFine,

    paidFine,

    pendingFine,

    entries:
      updatedEntries,
  };
}