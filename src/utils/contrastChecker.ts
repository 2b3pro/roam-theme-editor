// WCAG Contrast Ratio Calculations

// Convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Convert hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(c => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

// Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Calculate relative luminance (WCAG formula)
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export type WCAGLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

export interface ContrastResult {
  ratio: number;
  level: WCAGLevel;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
}

// Check WCAG compliance levels
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  // WCAG 2.1 thresholds:
  // AAA: 7:1 for normal text
  // AA: 4.5:1 for normal text
  // AA Large: 3:1 for large text (18pt+ or 14pt+ bold)

  const passesAAA = ratio >= 7;
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3;

  let level: WCAGLevel = 'fail';
  if (passesAAA) level = 'AAA';
  else if (passesAA) level = 'AA';
  else if (passesAALarge) level = 'AA-large';

  return {
    ratio,
    level,
    passesAA,
    passesAAA,
    passesAALarge,
  };
}

export interface PaletteContrastReport {
  textOnBackground: ContrastResult;
  textMutedOnBackground: ContrastResult;
  primaryOnBackground: ContrastResult;
  secondaryOnBackground: ContrastResult;
  textOnSurface: ContrastResult;
}

// Check all relevant contrast pairs in a palette
export function checkPaletteContrast(palette: {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}): PaletteContrastReport {
  return {
    textOnBackground: checkContrast(palette.text, palette.background),
    textMutedOnBackground: checkContrast(palette.textMuted, palette.background),
    primaryOnBackground: checkContrast(palette.primary, palette.background),
    secondaryOnBackground: checkContrast(palette.secondary, palette.background),
    textOnSurface: checkContrast(palette.text, palette.surface),
  };
}

// Get a label color class based on contrast level
export function getContrastLevelColor(level: WCAGLevel): string {
  switch (level) {
    case 'AAA':
      return 'text-green-600 dark:text-green-400';
    case 'AA':
      return 'text-blue-600 dark:text-blue-400';
    case 'AA-large':
      return 'text-amber-600 dark:text-amber-400';
    case 'fail':
      return 'text-red-600 dark:text-red-400';
  }
}

export function getContrastLevelBg(level: WCAGLevel): string {
  switch (level) {
    case 'AAA':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'AA':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case 'AA-large':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'fail':
      return 'bg-red-100 dark:bg-red-900/30';
  }
}

// Fix a foreground color to meet minimum contrast against a background
// Adjusts the lightness of the foreground color until it meets the target ratio
export function fixContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5 // Default to AA standard
): string {
  const currentRatio = getContrastRatio(foreground, background);
  if (currentRatio >= targetRatio) return foreground;

  const [fgH, fgS, fgL] = hexToHsl(foreground);
  const [, , bgL] = hexToHsl(background);

  // Determine if we need to go lighter or darker
  // If background is dark (L < 50), make foreground lighter
  // If background is light (L >= 50), make foreground darker
  const goLighter = bgL < 50;

  // Binary search for the right lightness
  let minL = goLighter ? fgL : 0;
  let maxL = goLighter ? 100 : fgL;
  let bestL = fgL;
  let bestColor = foreground;

  for (let i = 0; i < 20; i++) {
    const midL = (minL + maxL) / 2;
    const testColor = hslToHex(fgH, fgS, midL);
    const testRatio = getContrastRatio(testColor, background);

    if (testRatio >= targetRatio) {
      bestL = midL;
      bestColor = testColor;
      // Try to find a lightness closer to original
      if (goLighter) {
        maxL = midL;
      } else {
        minL = midL;
      }
    } else {
      // Need more contrast
      if (goLighter) {
        minL = midL;
      } else {
        maxL = midL;
      }
    }
  }

  return bestColor;
}

export type ContrastFixKey = 'text' | 'textMuted' | 'primary' | 'secondary';

// Get suggested fixes for all failing contrasts
export function getSuggestedFixes(palette: {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}): Record<ContrastFixKey, string | null> {
  const fixes: Record<ContrastFixKey, string | null> = {
    text: null,
    textMuted: null,
    primary: null,
    secondary: null,
  };

  const textResult = checkContrast(palette.text, palette.background);
  if (!textResult.passesAA) {
    fixes.text = fixContrast(palette.text, palette.background, 4.5);
  }

  const textMutedResult = checkContrast(palette.textMuted, palette.background);
  if (!textMutedResult.passesAA) {
    fixes.textMuted = fixContrast(palette.textMuted, palette.background, 4.5);
  }

  const primaryResult = checkContrast(palette.primary, palette.background);
  if (!primaryResult.passesAALarge) {
    fixes.primary = fixContrast(palette.primary, palette.background, 3);
  }

  const secondaryResult = checkContrast(palette.secondary, palette.background);
  if (!secondaryResult.passesAALarge) {
    fixes.secondary = fixContrast(palette.secondary, palette.background, 3);
  }

  return fixes;
}
