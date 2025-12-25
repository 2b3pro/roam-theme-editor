import type { TypographySettings } from '../../types/theme';
import { fontOptions, codeFontOptions, fontSizeOptions, lineHeightOptions } from '../../types/theme';

interface TypographyPanelProps {
  typography: TypographySettings;
  onChange: (typography: TypographySettings) => void;
}

export function TypographyPanel({ typography, onChange }: TypographyPanelProps) {
  const updateTypography = (key: keyof TypographySettings, value: string) => {
    onChange({ ...typography, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* Font Preview */}
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
        <p
          className="text-gray-800 dark:text-gray-200 mb-2"
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize,
            lineHeight: typography.lineHeight,
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </p>
        <p
          className="text-gray-600 dark:text-gray-400 text-sm"
          style={{ fontFamily: typography.codeFont }}
        >
          <code>const code = "example";</code>
        </p>
      </div>

      {/* Body Font */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Body Font
        </label>
        <select
          value={typography.fontFamily}
          onChange={(e) => updateTypography('fontFamily', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Heading Font */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Heading Font
        </label>
        <select
          value={typography.headingFont}
          onChange={(e) => updateTypography('headingFont', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Code Font */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Code Font
        </label>
        <select
          value={typography.codeFont}
          onChange={(e) => updateTypography('codeFont', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {codeFontOptions.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size & Line Height */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Font Size
          </label>
          <select
            value={typography.fontSize}
            onChange={(e) => updateTypography('fontSize', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {fontSizeOptions.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Line Height
          </label>
          <select
            value={typography.lineHeight}
            onChange={(e) => updateTypography('lineHeight', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {lineHeightOptions.map((lh) => (
              <option key={lh.value} value={lh.value}>
                {lh.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Note about Google Fonts */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Non-system fonts require Google Fonts import. The CSS output will include the necessary @import statement.
      </p>
    </div>
  );
}
