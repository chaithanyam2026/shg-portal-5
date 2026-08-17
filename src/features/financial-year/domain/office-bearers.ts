import { FINANCIAL_YEAR_STATUS, type FinancialYearStatus } from "./financial-year-status";

export function getCommitteeMemberId(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    if ("_id" in value && value._id) {
      return String(value._id);
    }

    if (typeof (value as { toString?: () => string }).toString === "function") {
      const id = (value as { toString: () => string }).toString();

      if (id && id !== "[object Object]") {
        return id;
      }
    }
  }

  return null;
}

/**
 * President, secretary, and treasurer of a financial year
 * may manage that year together with admin and steward roles.
 */
export function isFinancialYearOfficeBearer(
  committee:
    | {
      president?: unknown;
      secretary?: unknown;
      treasurer?: unknown;
    }
    | null
    | undefined,
  memberId: string | null | undefined,
): boolean {
  if (!committee || !memberId) {
    return false;
  }

  const officeBearerIds = [
    getCommitteeMemberId(committee.president),
    getCommitteeMemberId(committee.secretary),
    getCommitteeMemberId(committee.treasurer),
  ];

  return officeBearerIds.includes(memberId);
}

export function canManageFinancialYear(input: {
  committee:
  | {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  }
  | null
  | undefined;
  memberId: string | null | undefined;
  isSteward?: boolean;
}): boolean {
  return Boolean(input.isSteward) || isFinancialYearOfficeBearer(input.committee, input.memberId);
}

export function canEditFinancialYearFields(input: {
  status: FinancialYearStatus;
  committee:
  | {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  }
  | null
  | undefined;
  memberId: string | null | undefined;
  isSteward?: boolean;
}): boolean {
  if (
    input.status === FINANCIAL_YEAR_STATUS.APPROVED ||
    input.status === FINANCIAL_YEAR_STATUS.CLOSED
  ) {
    return false;
  }

  return canManageFinancialYear(input);
}
