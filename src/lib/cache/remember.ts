import { cache } from "react";
import { unstable_cache } from "next/cache";

import type { CacheTag } from "./tags";

type RememberOptions = {
  key: string;
  tags: CacheTag[];
  revalidate: number;
};

/**
 * Deduplicates work within a request (`cache`) and reuses the result
 * across requests until `revalidate` seconds pass or a matching tag is
 * invalidated.
 */
export function remember<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: RememberOptions,
): (...args: Args) => Promise<Result> {
  const cached = unstable_cache(fn, [options.key], {
    revalidate: options.revalidate,
    tags: options.tags,
  });

  return cache(cached);
}
