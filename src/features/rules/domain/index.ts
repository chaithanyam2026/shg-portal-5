export const RULE_STATUSES = ["DRAFT", "APPROVED"] as const;

export type RuleStatus = (typeof RULE_STATUSES)[number];

export type ClubRule = {
  id: string;
  text: string;
  order: number;
};

export type ClubRuleSection = {
  id: string;
  title: string;
  rules: ClubRule[];
};

export type ClubRulesDocument = {
  id: string;
  title: string;
  description: string;
  version: number;
  status: RuleStatus;
  createdAt: string;
  createdBy: string;
  approvedAt: string | null;
  approvedBy: string | null;
  effectiveFrom: string;
  effectiveUntil: string | null;
  sections: ClubRuleSection[];
  updatedAt: string;
  updatedBy: string;
};

export function orderClubRules(document: ClubRulesDocument): ClubRulesDocument {
  return {
    ...document,
    sections: document.sections.map((section) => ({
      ...section,
      rules: [...section.rules].sort((left, right) => left.order - right.order),
    })),
  };
}
