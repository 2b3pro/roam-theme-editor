import { checkPaletteContrast, getSuggestedFixes, getContrastLevelColor, getContrastLevelBg, type ContrastResult, type ContrastFixKey } from '../../utils/contrastChecker';
import type { ColorPalette } from '../../types/theme';

interface ContrastCheckerProps {
  palette: ColorPalette;
  onFixColor?: (key: keyof ColorPalette['colors'], value: string) => void;
}

interface ContrastRowProps {
  label: string;
  result: ContrastResult;
  fg: string;
  bg: string;
  fixValue?: string | null;
  onFix?: () => void;
}

function ContrastRow({ label, result, fg, bg, fixValue, onFix }: ContrastRowProps) {
  const needsFix = fixValue !== null && fixValue !== undefined;

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: bg, color: fg }}
        >
          Aa
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {result.ratio.toFixed(2)}:1
        </span>
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getContrastLevelBg(result.level)} ${getContrastLevelColor(result.level)}`}>
          {result.level === 'fail' ? 'Fail' : result.level}
        </span>
        {needsFix && onFix && (
          <button
            onClick={onFix}
            className="flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            title={`Fix to ${fixValue}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Fix
          </button>
        )}
      </div>
    </div>
  );
}

export function ContrastChecker({ palette, onFixColor }: ContrastCheckerProps) {
  const report = checkPaletteContrast(palette.colors);
  const fixes = getSuggestedFixes(palette.colors);

  const hasIssues = !report.textOnBackground.passesAA ||
                    !report.primaryOnBackground.passesAALarge ||
                    !report.secondaryOnBackground.passesAALarge;

  const hasFixableIssues = Object.values(fixes).some(f => f !== null);

  const handleFix = (key: ContrastFixKey) => {
    const fixValue = fixes[key];
    if (fixValue && onFixColor) {
      onFixColor(key, fixValue);
    }
  };

  const handleFixAll = () => {
    if (!onFixColor) return;
    (Object.keys(fixes) as ContrastFixKey[]).forEach(key => {
      const fixValue = fixes[key];
      if (fixValue) {
        onFixColor(key, fixValue);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-lg ${hasIssues ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasIssues ? (
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={`text-sm font-medium ${hasIssues ? 'text-amber-800 dark:text-amber-200' : 'text-green-800 dark:text-green-200'}`}>
              {hasIssues ? 'Contrast issues detected' : 'All contrasts pass WCAG AA'}
            </span>
          </div>
          {hasFixableIssues && onFixColor && (
            <button
              onClick={handleFixAll}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fix All
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Text Contrast
        </h4>
        <ContrastRow
          label="Text on Background"
          result={report.textOnBackground}
          fg={palette.colors.text}
          bg={palette.colors.background}
          fixValue={fixes.text}
          onFix={() => handleFix('text')}
        />
        <ContrastRow
          label="Muted on Background"
          result={report.textMutedOnBackground}
          fg={palette.colors.textMuted}
          bg={palette.colors.background}
          fixValue={fixes.textMuted}
          onFix={() => handleFix('textMuted')}
        />
        <ContrastRow
          label="Text on Surface"
          result={report.textOnSurface}
          fg={palette.colors.text}
          bg={palette.colors.surface}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Accent Contrast
        </h4>
        <ContrastRow
          label="Links (Primary)"
          result={report.primaryOnBackground}
          fg={palette.colors.primary}
          bg={palette.colors.background}
          fixValue={fixes.primary}
          onFix={() => handleFix('primary')}
        />
        <ContrastRow
          label="Tags (Secondary)"
          result={report.secondaryOnBackground}
          fg={palette.colors.secondary}
          bg={palette.colors.background}
          fixValue={fixes.secondary}
          onFix={() => handleFix('secondary')}
        />
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p><span className="font-semibold text-green-600 dark:text-green-400">AAA</span> = 7:1+ (enhanced)</p>
        <p><span className="font-semibold text-blue-600 dark:text-blue-400">AA</span> = 4.5:1+ (normal text)</p>
        <p><span className="font-semibold text-amber-600 dark:text-amber-400">AA-large</span> = 3:1+ (large text only)</p>
      </div>
    </div>
  );
}
