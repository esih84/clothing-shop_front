/**
 * Builds the site's whole colour palette from the two brand colours the admin
 * picks in the panel.
 *
 * Only `theme.primary` and `theme.secondary` are editable. Everything else —
 * the text colour on top of each brand colour, the tinted neutrals, the dark
 * theme — is derived here, for two reasons: the panel stays a two-field form
 * instead of a forty-field one, and an admin cannot produce an unreadable
 * combination such as white text on a pale yellow button.
 *
 * The output overrides the `:root` / `.dark` blocks in `globals.css`. Tailwind v3
 * flattens its `@layer base` directive into plain rules rather than a real CSS
 * cascade layer, so those blocks are ordinary `:root` / `.dark` selectors and
 * whichever comes last would win. Rather than depend on where the browser ends
 * up putting the injected <style>, the selectors here carry one extra class of
 * specificity — `:root:not(.dark)` and `:root.dark` — so they win by rank, in
 * any order. They stay mutually exclusive, so the light block can never leak
 * into dark mode. Tokens not listed here keep the stylesheet's values.
 */

export interface Hsl {
  h: number;
  /** Percent. */
  s: number;
  /** Percent. */
  l: number;
}

/** `#1473E6` → `{ h: 212, s: 82, l: 49 }`. Falls back to mid grey on junk input. */
export function hexToHsl(hex: string): Hsl {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!match) return { h: 0, s: 0, l: 50 };

  const int = parseInt(match[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** A CSS variable value: the space-separated triplet `hsl()` expects. */
function triplet({ h, s, l }: Hsl): string {
  return `${h} ${s}% ${l}%`;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Same hue, forced saturation/lightness — used to build the tinted neutrals. */
function shade(base: Hsl, s: number, l: number): Hsl {
  return { h: base.h, s, l };
}

/**
 * Black or white text for a given background, whichever has more contrast.
 *
 * Perceived brightness, not lightness: pure yellow and pure blue both sit near
 * L=50 but yellow needs dark text and blue needs white. The coefficients are
 * the sRGB luma weights.
 */
function readableOn(color: Hsl, ink: Hsl): Hsl {
  const { h, s, l } = color;
  const c = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - c / 2;

  const [r, g, b] = (
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  ).map((channel) => channel + m);

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 0.55 ? ink : { h: 0, s: 0, l: 100 };
}

/**
 * The CSS text to inject. Written as two rule blocks rather than a stylesheet
 * import because the values are per-deployment, not per-build.
 */
export function buildThemeCss(primaryHex: string, secondaryHex: string): string {
  const primary = hexToHsl(primaryHex);
  const secondary = hexToHsl(secondaryHex);

  // Near-black carrying the brand hue. Fixed in both themes: it backs the
  // category gradients and the banner captions, which sit on light artwork and
  // must stay dark even when the rest of the page flips to dark mode.
  const ink = shade(secondary, 39, 11);
  // The brand colour at a lightness that is always readable on white artwork.
  const onLight = { ...secondary, l: clamp(secondary.l, 30, 48) };
  // The mid-dark step of the category gradients.
  const deep = shade(secondary, clamp(secondary.s, 40, 90), 26);

  const light = {
    "--background": triplet(shade(primary, 33, 98)),
    "--muted": triplet(shade(primary, 30, 95)),
    "--border": triplet(shade(primary, 25, 88)),
    "--input": triplet(shade(primary, 25, 88)),
    "--primary": triplet(primary),
    "--primary-foreground": triplet(readableOn(primary, ink)),
    "--secondary": triplet(secondary),
    "--secondary-foreground": triplet(readableOn(secondary, ink)),
    "--accent": triplet(shade(secondary, 90, 94)),
    "--accent-foreground": triplet(shade(secondary, 88, 30)),
    "--ring": triplet(secondary),
    "--main": triplet(primary),
    "--chart-1": triplet(primary),
    "--chart-2": triplet(secondary),
  };

  // Dark mode reuses the same two hues: the brand colours are lifted so they
  // still read against a dark ground, and the neutrals are built from the
  // secondary hue the way the hand-written palette was.
  const darkPrimary = { ...primary, l: clamp(primary.l + 3, 30, 70) };
  const darkSecondary = { ...secondary, l: clamp(secondary.l + 12, 45, 72) };

  const dark = {
    "--background": triplet(shade(secondary, 20, 10)),
    "--foreground": triplet(shade(primary, 30, 94)),
    "--card": triplet(shade(secondary, 18, 14)),
    "--card-foreground": triplet(shade(primary, 30, 94)),
    "--popover": triplet(shade(secondary, 18, 14)),
    "--popover-foreground": triplet(shade(primary, 30, 94)),
    "--muted": triplet(shade(secondary, 16, 20)),
    "--border": triplet(shade(secondary, 15, 24)),
    "--input": triplet(shade(secondary, 15, 24)),
    "--primary": triplet(darkPrimary),
    "--primary-foreground": triplet(readableOn(darkPrimary, ink)),
    "--secondary": triplet(darkSecondary),
    "--secondary-foreground": triplet(readableOn(darkSecondary, ink)),
    "--accent": triplet(shade(secondary, 45, 22)),
    "--accent-foreground": triplet(shade(secondary, 90, 85)),
    "--ring": triplet(darkSecondary),
    "--main": triplet(darkPrimary),
    "--chart-1": triplet(darkPrimary),
    "--chart-2": triplet(darkSecondary),
  };

  const shared = {
    "--brand-ink": triplet(ink),
    "--brand-deep": triplet(deep),
    "--brand-on-light": triplet(onLight),
  };

  const block = (selector: string, vars: Record<string, string>) =>
    `${selector}{${Object.entries(vars)
      .map(([name, value]) => `${name}:${value}`)
      .join(";")}}`;

  return (
    // `shared` goes on plain :root so the three theme-invariant tokens apply in
    // both modes; nothing in the stylesheet defines them, so no rank is needed.
    block(":root", shared) +
    block(":root:not(.dark)", light) +
    block(":root.dark", dark)
  );
}

/**
 * The same derived colours as concrete `hsl()` strings.
 *
 * The OG image is rendered by Satori, which resolves no CSS variables and has
 * no :root to read them from, so that one place needs the values themselves.
 */
export function brandColors(primaryHex: string, secondaryHex: string) {
  const primary = hexToHsl(primaryHex);
  const secondary = hexToHsl(secondaryHex);
  const css = (color: Hsl) => `hsl(${color.h} ${color.s}% ${color.l}%)`;

  return {
    primary: css(primary),
    secondary: css(secondary),
    deep: css(shade(secondary, clamp(secondary.s, 40, 90), 26)),
    ink: css(shade(secondary, 39, 11)),
  };
}
