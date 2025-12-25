import { useState } from 'react';
import { parseColorPaletteUrl, generatePaletteFromUrlColors } from '../../utils/paletteUrlParser';
import type { ColorPalette } from '../../types/theme';

interface UrlPaletteImporterProps {
  onApplyPalette: (light: ColorPalette, dark: ColorPalette) => void;
}

export function UrlPaletteImporter({ onApplyPalette }: UrlPaletteImporterProps) {
  const [url, setUrl] = useState('');
  const [parsedColors, setParsedColors] = useState<string[] | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    setError(null);
    setParsedColors(null);
    setSource(null);

    if (!url.trim()) {
      setError('Please enter a URL or hex codes');
      return;
    }

    const result = parseColorPaletteUrl(url);

    if (!result) {
      setError('Could not parse colors. Try a Coolors.co or ColorHunt URL, or paste hex codes like #264653 #2a9d8f');
      return;
    }

    setParsedColors(result.colors);
    setSource(result.source);
  };

  const handleApply = () => {
    if (!parsedColors || parsedColors.length === 0) return;

    const lightColors = generatePaletteFromUrlColors(parsedColors, false);
    const darkColors = generatePaletteFromUrlColors(parsedColors, true);

    const lightPalette: ColorPalette = {
      name: `From ${source || 'URL'} (Light)`,
      colors: lightColors,
    };

    const darkPalette: ColorPalette = {
      name: `From ${source || 'URL'} (Dark)`,
      colors: darkColors,
    };

    onApplyPalette(lightPalette, darkPalette);
    setUrl('');
    setParsedColors(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Import from URL
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleParse()}
            placeholder="Coolors.co URL or hex codes..."
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button
            onClick={handleParse}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Parse
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Supports Coolors.co, ColorHunt, or hex codes
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {parsedColors && parsedColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {source && source !== 'unknown' && (
                <span className="capitalize">{source}</span>
              )} Colors
            </span>
            <span className="text-xs text-gray-400">{parsedColors.length} colors</span>
          </div>

          <div className="flex gap-1">
            {parsedColors.map((color, idx) => (
              <div
                key={idx}
                className="flex-1 h-8 rounded first:rounded-l-lg last:rounded-r-lg relative group"
                style={{ backgroundColor: color }}
                title={color}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-black/50 text-white rounded">
                  {color}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Apply to Theme
          </button>
        </div>
      )}
    </div>
  );
}
