/**
 * Normalizes Persian text for searching and comparison: unifies the
 * Arabic/Persian letter variants a keyboard may produce and drops the
 * zero-width non-joiner and spaces, so «بستان اباد» matches «بستان‌آباد».
 */
export function normalizePersian(value: string): string {
  return (value ?? "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[‌\s]/g, "");
}
