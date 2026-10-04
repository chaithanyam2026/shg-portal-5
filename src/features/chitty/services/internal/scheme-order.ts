import type { ChittySchemeOption } from "../../types";

export function sortChittySchemes<T extends Pick<ChittySchemeOption, "status" | "startDate">>(
  schemes: T[],
): T[] {
  return [...schemes].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "ACTIVE" ? -1 : 1;
    }

    return left.startDate.localeCompare(right.startDate);
  });
}

export function defaultChittyId(schemes: ChittySchemeOption[]): string | null {
  return schemes.find((scheme) => scheme.status === "ACTIVE")?.id ?? schemes[0]?.id ?? null;
}
