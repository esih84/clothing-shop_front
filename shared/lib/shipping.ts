import type { ShippingMethod } from "@/features/shipping-method/shipping-method-api";
import { normalizePersian } from "@/shared/lib/persian-text";

/** Whether a method's city list covers the given city (Persian-normalized match). */
function coversCity(method: ShippingMethod, city: string): boolean {
  const target = normalizePersian(city);
  if (!target) return false;
  return (method.cities ?? []).some((c) => normalizePersian(c) === target);
}

/**
 * The methods offered for a city, in display order. Mirrors the same rule on the
 * backend (shipping-methods.util.ts), which validates the submitted method again
 * before the order is created.
 *
 * A method with an empty `cities` list is global. A city-scoped method that has
 * `replacesGlobal` set hides the global ones for that city — this is how the
 * Mashhad courier replaces tipax/post instead of being listed next to them.
 */
export function shippingMethodsFor(
  city: string,
  methods: ShippingMethod[],
): ShippingMethod[] {
  const active = methods.filter((m) => m.isActive);
  const cityScoped = active.filter(
    (m) => (m.cities ?? []).length > 0 && coversCity(m, city),
  );
  const global = active.filter((m) => (m.cities ?? []).length === 0);
  const list = cityScoped.some((m) => m.replacesGlobal)
    ? cityScoped
    : [...cityScoped, ...global];
  return [...list].sort((a, b) => a.order - b.order);
}
