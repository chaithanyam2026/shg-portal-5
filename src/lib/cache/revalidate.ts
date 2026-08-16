import { revalidateTag } from "next/cache";

import { CACHE_TAGS, type CacheTag } from "./tags";

export function revalidateCacheTags(...tags: CacheTag[]): void {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

export function revalidateMembers(): void {
  revalidateCacheTags(CACHE_TAGS.members);
}

export function revalidateFinancialYears(): void {
  revalidateCacheTags(CACHE_TAGS.financialYears);
}

export function revalidateMeetings(): void {
  revalidateCacheTags(CACHE_TAGS.meetings);
}

export function revalidateLoans(): void {
  revalidateCacheTags(CACHE_TAGS.loans);
}

export function revalidateMeetingWrites(): void {
  revalidateCacheTags(CACHE_TAGS.meetings, CACHE_TAGS.loans);
}

export function revalidateFinancialYearWrites(): void {
  revalidateCacheTags(CACHE_TAGS.financialYears, CACHE_TAGS.meetings, CACHE_TAGS.loans);
}
