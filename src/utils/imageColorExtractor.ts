// Extract dominant colors from an image using canvas sampling and k-means clustering

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Simple k-means clustering to find dominant colors
function kMeansClustering(colors: RGB[], k: number, iterations: number = 10): RGB[] {
  if (colors.length === 0) return [];
  if (colors.length <= k) return colors;

  // Initialize centroids randomly from the color set
  const centroids: RGB[] = [];
  const usedIndices = new Set<number>();

  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * colors.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      centroids.push({ ...colors[idx] });
    }
  }

  for (let iter = 0; iter < iterations; iter++) {
    // Assign colors to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    for (const color of colors) {
      let minDist = Infinity;
      let nearestIdx = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(color, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = i;
        }
      }

      clusters[nearestIdx].push(color);
    }

    // Update centroids
    for (let i = 0; i < k; i++) {
      if (clusters[i].length > 0) {
        centroids[i] = {
          r: clusters[i].reduce((sum, c) => sum + c.r, 0) / clusters[i].length,
          g: clusters[i].reduce((sum, c) => sum + c.g, 0) / clusters[i].length,
          b: clusters[i].reduce((sum, c) => sum + c.b, 0) / clusters[i].length,
        };
      }
    }
  }

  return centroids;
}

// Extract colors from image using canvas
export async function extractColorsFromImage(
  imageSource: string | File,
  numColors: number = 6
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Scale down for performance
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colors: RGB[] = [];

      // Sample every 4th pixel to reduce processing
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Skip very dark or very light pixels for better palette
        const lum = getLuminance(r, g, b);
        if (lum > 0.05 && lum < 0.95) {
          colors.push({ r, g, b });
        }
      }

      if (colors.length === 0) {
        reject(new Error('No colors found in image'));
        return;
      }

      // Run k-means to find dominant colors
      const dominantColors = kMeansClustering(colors, numColors * 2, 15);

      // Sort by luminance and convert to hex
      const sortedColors = dominantColors
        .map(c => ({
          hex: rgbToHex(c.r, c.g, c.b),
          lum: getLuminance(c.r, c.g, c.b),
          saturation: Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b),
        }))
        // Prefer more saturated colors
        .sort((a, b) => b.saturation - a.saturation)
        .slice(0, numColors)
        .sort((a, b) => b.lum - a.lum)
        .map(c => c.hex);

      resolve(sortedColors);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(imageSource);
    }
  });
}

// Generate a full palette from extracted colors
export function generatePaletteFromColors(
  extractedColors: string[],
  isDark: boolean
): { primary: string; secondary: string; background: string; surface: string; text: string; textMuted: string; border: string } {
  // Sort colors by luminance
  const sorted = extractedColors
    .map(hex => ({ hex, lum: getLuminance(...Object.values(hexToRgb(hex)) as [number, number, number]) }))
    .sort((a, b) => b.lum - a.lum);

  if (isDark) {
    // For dark mode: use darker colors for backgrounds, lighter for text
    const darkest = sorted[sorted.length - 1]?.hex || '#1a1a2e';
    const midDark = sorted[Math.floor(sorted.length * 0.7)]?.hex || '#16213e';
    const accent1 = sorted[Math.floor(sorted.length * 0.3)]?.hex || '#e94560';
    const accent2 = sorted[Math.floor(sorted.length * 0.4)]?.hex || '#0f3460';

    return {
      primary: accent1,
      secondary: accent2,
      background: adjustLightness(darkest, -30),
      surface: adjustLightness(midDark, -20),
      text: '#f0f0f0',
      textMuted: '#a0a0a0',
      border: adjustLightness(midDark, 10),
    };
  } else {
    // For light mode: use lighter colors for backgrounds, darker for text
    const lightest = sorted[0]?.hex || '#ffffff';
    const midLight = sorted[Math.floor(sorted.length * 0.2)]?.hex || '#f5f5f5';
    const accent1 = sorted[Math.floor(sorted.length * 0.5)]?.hex || '#3498db';
    const accent2 = sorted[Math.floor(sorted.length * 0.6)]?.hex || '#e74c3c';

    return {
      primary: accent1,
      secondary: accent2,
      background: adjustLightness(lightest, 20),
      surface: adjustLightness(midLight, 10),
      text: '#1a1a1a',
      textMuted: '#6b7280',
      border: adjustLightness(midLight, -15),
    };
  }
}

// Adjust lightness of a hex color
function adjustLightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  const factor = 1 + amount / 100;

  return rgbToHex(
    Math.max(0, Math.min(255, rgb.r * factor)),
    Math.max(0, Math.min(255, rgb.g * factor)),
    Math.max(0, Math.min(255, rgb.b * factor))
  );
}
