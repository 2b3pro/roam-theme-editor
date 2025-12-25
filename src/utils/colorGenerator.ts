import type { ColorPalette } from '../types/theme';

export type ColorHarmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic';

// Convert hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
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

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate random hue
function randomHue(): number {
  return Math.floor(Math.random() * 360);
}

// Generate colors based on harmony type
function generateHarmonyColors(baseHue: number, harmony: ColorHarmony): number[] {
  switch (harmony) {
    case 'complementary':
      return [baseHue, (baseHue + 180) % 360];
    case 'analogous':
      return [baseHue, (baseHue + 30) % 360, (baseHue + 330) % 360];
    case 'triadic':
      return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
    case 'split-complementary':
      return [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
    case 'monochromatic':
      return [baseHue, baseHue, baseHue];
    default:
      return [baseHue];
  }
}

// Extract hue from hex color
export function hexToHue(hex: string): number {
  const [h] = hexToHsl(hex);
  return h;
}

export function generateRandomPalette(
  harmony: ColorHarmony,
  isDark: boolean,
  baseHue?: number
): ColorPalette {
  const hue = baseHue !== undefined ? baseHue : randomHue();
  const hues = generateHarmonyColors(hue, harmony);

  const primaryHue = hues[0];
  const secondaryHue = hues[1] || (primaryHue + 60) % 360;

  if (isDark) {
    return {
      name: `Random ${harmony} Dark`,
      colors: {
        primary: hslToHex(primaryHue, 70, 60),
        secondary: hslToHex(secondaryHue, 65, 55),
        background: hslToHex(primaryHue, 15, 12),
        surface: hslToHex(primaryHue, 12, 18),
        text: hslToHex(primaryHue, 10, 90),
        textMuted: hslToHex(primaryHue, 8, 60),
        border: hslToHex(primaryHue, 10, 25),
      },
    };
  } else {
    return {
      name: `Random ${harmony} Light`,
      colors: {
        primary: hslToHex(primaryHue, 70, 45),
        secondary: hslToHex(secondaryHue, 65, 50),
        background: hslToHex(primaryHue, 20, 98),
        surface: hslToHex(primaryHue, 25, 94),
        text: hslToHex(primaryHue, 20, 15),
        textMuted: hslToHex(primaryHue, 15, 45),
        border: hslToHex(primaryHue, 15, 85),
      },
    };
  }
}

export const harmonyDescriptions: Record<ColorHarmony, string> = {
  complementary: 'Opposite colors for high contrast',
  analogous: 'Adjacent colors for harmony',
  triadic: 'Three evenly spaced colors',
  'split-complementary': 'Base + two adjacent to complement',
  monochromatic: 'Single hue with varied lightness',
};
