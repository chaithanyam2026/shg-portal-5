import type { FinancialYearDetails } from "../types";

export type ValidationResult = {
  valid: boolean;
  items: Array<{
    label: string;
    valid: boolean;
  }>;
};

export function validateFinancialYear(
  financialYear: FinancialYearDetails,
): ValidationResult {
  const items = [
    {
      label: "General information completed",
      valid:
        financialYear.name.trim().length > 0 &&
        financialYear.startDate <
          financialYear.endDate,
    },
    {
      label: "Members assigned",
      valid:
        financialYear.members.length > 0,
    },
    {
      label:
        "Executive Committee configured",
      valid:
        !!financialYear.executiveCommittee
          .president &&
        !!financialYear.executiveCommittee
          .secretary &&
        !!financialYear.executiveCommittee
          .treasurer,
    },
    {
      label:
        "Opening accounts configured",
      valid: true,
    },
  ];

  return {
    valid: items.every(
      (item) => item.valid,
    ),
    items,
  };
}