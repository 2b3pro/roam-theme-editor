// Parse color palettes from popular palette service URLs

export interface ParsedPalette {
  colors: string[];
  source: 'coolors' | 'adobe' | 'colorhunt' | 'unknown';
}

// Coolors.co URL format: https://coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51
// or https://coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51
function parseCoolorsUrl(url: string): string[] | null {
  const patterns = [
    /coolors\.co\/(?:palette\/)?([a-f0-9]{6}(?:-[a-f0-9]{6})*)/i,
    /coolors\.co\/([a-f0-9]{6}(?:-[a-f0-9]{6})*)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const colorString = match[1];
      return colorString.split('-').map(c => `#${c}`);
    }
  }
  return null;
}

// ColorHunt URL format: https://colorhunt.co/palette/222831393e4600adb5eeeeee
function parseColorHuntUrl(url: string): string[] | null {
  const match = url.match(/colorhunt\.co\/palette\/([a-f0-9]+)/i);
  if (match) {
    const colorString = match[1];
    // ColorHunt concatenates 6-char hex values without separators
    const colors: string[] = [];
    for (let i = 0; i < colorString.length; i += 6) {
      if (i + 6 <= colorString.length) {
        colors.push(`#${colorString.slice(i, i + 6)}`);
      }
    }
    return colors.length > 0 ? colors : null;
  }
  return null;
}

// Try to parse plain hex codes (comma or space separated)
function parsePlainHexCodes(input: string): string[] | null {
  // Match hex codes with or without # prefix
  const matches = input.match(/(?:#?[a-f0-9]{6})/gi);
  if (matches && matches.length > 0) {
    return matches.map(c => c.startsWith('#') ? c : `#${c}`);
  }
  return null;
}

export function parseColorPaletteUrl(input: string): ParsedPalette | null {
  const trimmed = input.trim();

  // Try Coolors
  const coolorsColors = parseCoolorsUrl(trimmed);
  if (coolorsColors) {
    return { colors: coolorsColors, source: 'coolors' };
  }

  // Try ColorHunt
  const colorHuntColors = parseColorHuntUrl(trimmed);
  if (colorHuntColors) {
    return { colors: colorHuntColors, source: 'colorhunt' };
  }

  // Try plain hex codes
  const plainColors = parsePlainHexCodes(trimmed);
  if (plainColors) {
    return { colors: plainColors, source: 'unknown' };
  }

  return null;
}

// Generate light and dark palette from extracted colors
export function generatePaletteFromUrlColors(
  colors: string[],
  isDark: boolean
): { primary: string; secondary: string; background: string; surface: string; text: string; textMuted: string; border: string } {
  // Sort by luminance
  const sorted = colors
    .map(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return { hex, lum };
    })
    .sort((a, b) => b.lum - a.lum);

  if (isDark) {
    // Dark mode: darkest colors for backgrounds, lighter for accents
    return {
      primary: sorted[Math.floor(sorted.length * 0.3)]?.hex || '#60a5fa',
      secondary: sorted[Math.floor(sorted.length * 0.5)]?.hex || '#a78bfa',
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text: '#f0f0f0',
      textMuted: '#9ca3af',
      border: '#2a2a2a',
    };
  } else {
    // Light mode: lightest colors for backgrounds, darker for accents
    return {
      primary: sorted[Math.floor(sorted.length * 0.6)]?.hex || '#3b82f6',
      secondary: sorted[Math.floor(sorted.length * 0.4)]?.hex || '#8b5cf6',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
    };
  }
}
