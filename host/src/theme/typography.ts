export const fontFamilies = {
  display: '"Cormorant Garamond", "EB Garamond", "Times New Roman", serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const;

export const fontFamily = fontFamilies.body;
export const fontFamilyDisplay = fontFamilies.display;
export const fontFamilyMonospace = fontFamilies.mono;

export const appFontSizes = {
  micro: "0.5625rem",
  "2xs": "0.625rem",
  caption: "0.8125rem",
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "2.25rem",
  "4xl": "3rem",
  "5xl": "4rem",
  hero: "4rem",
} as const;

export const muiFontSizes = {
  xs: appFontSizes.xs,
  sm: appFontSizes.sm,
  md: appFontSizes.base,
  lg: appFontSizes.lg,
  xl: appFontSizes.xl,
};

export const appLineHeights = {
  none: "1",
  tight: "1.1",
  snug: "1.3",
  normal: "1.55",
  relaxed: "1.65",
  reader: "1.75",
} as const;

export const appRadius = {
  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "9999px",
  full: "9999px",
} as const;
