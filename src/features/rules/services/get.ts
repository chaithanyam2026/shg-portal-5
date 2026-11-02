import rulesDocument from "../data/club-rules.json";
import { orderClubRules, type ClubRulesDocument } from "../domain";
import { ClubRulesDocumentSchema } from "../validation";

export function getClubRules(): ClubRulesDocument {
  return orderClubRules(ClubRulesDocumentSchema.parse(rulesDocument));
}
