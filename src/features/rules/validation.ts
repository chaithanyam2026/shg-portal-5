import { z } from "zod";

import { RULE_STATUSES } from "./domain";

const ClubRuleSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  order: z.number().int().positive(),
});

const ClubRuleSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  rules: z.array(ClubRuleSchema),
});

export const ClubRulesDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  version: z.number().int().positive(),
  status: z.enum(RULE_STATUSES),
  createdAt: z.iso.datetime(),
  createdBy: z.string().min(1),
  approvedAt: z.iso.datetime().nullable(),
  approvedBy: z.string().min(1).nullable(),
  effectiveFrom: z.iso.date(),
  effectiveUntil: z.iso.date().nullable(),
  sections: z.array(ClubRuleSectionSchema),
  updatedAt: z.iso.datetime(),
  updatedBy: z.string().min(1),
});
