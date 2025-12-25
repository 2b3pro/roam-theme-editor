import { useState, useMemo } from 'react';
import { RoamMockup } from './components/Preview/RoamMockup';
import { ColorPicker } from './components/Editor/ColorPicker';
import type { ColorPalette, ThemeMode } from './types/theme';

// Default palettes
const defaultLightPalette: ColorPalette = {
  name: 'Light Default',
  colors: {
    primary: '#137cbd',
    secondary: '#d9822b',
    background: '#ffffff',
    surface: '#f5f8fa',
    text: '#182026',
    textMuted: '#5c7080',
    border: '#d8e1e8',
  },
};

const defaultDarkPalette: ColorPalette = {
  name: 'Dark Default',
  colors: {
    primary: '#48aff0',
    secondary: '#ffb366',
    background: '#1c2127',
    surface: '#252a31',
    text: '#f5f8fa',
    textMuted: '#a7b6c2',
    border: '#394b59',
  },
};

function App() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [lightPalette, setLightPalette] = useState<ColorPalette>(defaultLightPalette);
  const [darkPalette, setDarkPalette] = useState<ColorPalette>(defaultDarkPalette);
  const [copied, setCopied] = useState(false);

  // Determine active palette based on mode
  const activePalette = useMemo(() => {
    if (mode === 'dark') return darkPalette;
    if (mode === 'light') return lightPalette;
    // For system mode, use browser preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return darkPalette;
    }
    return lightPalette;
  }, [mode, lightPalette, darkPalette]);

  const currentPalette = mode === 'dark' ? darkPalette : lightPalette;
  const setCurrentPalette = mode === 'dark' ? setDarkPalette : setLightPalette;

  const updateColor = (key: keyof ColorPalette['colors'], value: string) => {
    setCurrentPalette((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  // Generate CSS output
  const generateCSS = () => {
    const lightCSS = `/* Light Mode */
:root {
  --page-link-color: ${lightPalette.colors.primary};
  --tag-bg-color: ${lightPalette.colors.secondary}20;
  --tag-font-color: ${lightPalette.colors.secondary};
  --body-bg: ${lightPalette.colors.background};
  --sidebar-bg: ${lightPalette.colors.surface};
  --main-font-color: ${lightPalette.colors.text};
  --page-bracket-color: ${lightPalette.colors.textMuted};
  --highlight-background-color: ${lightPalette.colors.primary}30;
}`;

    const darkCSS = `/* Dark Mode */
:root {
  --page-link-color: ${darkPalette.colors.primary};
  --tag-bg-color: ${darkPalette.colors.secondary}20;
  --tag-font-color: ${darkPalette.colors.secondary};
  --body-bg: ${darkPalette.colors.background};
  --sidebar-bg: ${darkPalette.colors.surface};
  --main-font-color: ${darkPalette.colors.text};
  --page-bracket-color: ${darkPalette.colors.textMuted};
  --highlight-background-color: ${darkPalette.colors.primary}30;
}`;

    if (mode === 'light') return lightCSS;
    if (mode === 'dark') return darkCSS;

    // System mode - include media queries
    return `/* Roam Theme - Auto Light/Dark */

/* Light Mode */
@media (prefers-color-scheme: light) {
  :root {
    --page-link-color: ${lightPalette.colors.primary};
    --tag-bg-color: ${lightPalette.colors.secondary}20;
    --tag-font-color: ${lightPalette.colors.secondary};
    --body-bg: ${lightPalette.colors.background};
    --sidebar-bg: ${lightPalette.colors.surface};
    --main-font-color: ${lightPalette.colors.text};
    --page-bracket-color: ${lightPalette.colors.textMuted};
    --highlight-background-color: ${lightPalette.colors.primary}30;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --page-link-color: ${darkPalette.colors.primary};
    --tag-bg-color: ${darkPalette.colors.secondary}20;
    --tag-font-color: ${darkPalette.colors.secondary};
    --body-bg: ${darkPalette.colors.background};
    --sidebar-bg: ${darkPalette.colors.surface};
    --main-font-color: ${darkPalette.colors.text};
    --page-bracket-color: ${darkPalette.colors.textMuted};
    --highlight-background-color: ${darkPalette.colors.primary}30;
  }
}`;
  };

  const handleCopyCSS = async () => {
    const css = generateCSS();
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Roam Theme Editor
          </h1>
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    mode === m
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* Copy CSS Button */}
            <button
              onClick={handleCopyCSS}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy CSS
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Colors ({mode === 'system' ? 'Editing Both' : mode.charAt(0).toUpperCase() + mode.slice(1)})
              </h2>

              <div className="space-y-4">
                <ColorPicker
                  label="Primary (Links)"
                  value={currentPalette.colors.primary}
                  onChange={(v) => updateColor('primary', v)}
                />
                <ColorPicker
                  label="Secondary (Tags)"
                  value={currentPalette.colors.secondary}
                  onChange={(v) => updateColor('secondary', v)}
                />
                <ColorPicker
                  label="Background"
                  value={currentPalette.colors.background}
                  onChange={(v) => updateColor('background', v)}
                />
                <ColorPicker
                  label="Surface (Sidebar)"
                  value={currentPalette.colors.surface}
                  onChange={(v) => updateColor('surface', v)}
                />
                <ColorPicker
                  label="Text"
                  value={currentPalette.colors.text}
                  onChange={(v) => updateColor('text', v)}
                />
                <ColorPicker
                  label="Text Muted"
                  value={currentPalette.colors.textMuted}
                  onChange={(v) => updateColor('textMuted', v)}
                />
                <ColorPicker
                  label="Border"
                  value={currentPalette.colors.border}
                  onChange={(v) => updateColor('border', v)}
                />
              </div>

              {mode === 'system' && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Switch to Light or Dark mode to edit individual palettes.
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                How to use your theme
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                <li>Customize colors using the pickers above</li>
                <li>Click "Copy CSS" to copy the theme</li>
                <li>In Roam, go to <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[[roam/css]]</code></li>
                <li>Create a code block and paste the CSS</li>
              </ol>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview
            </h2>
            <RoamMockup palette={activePalette} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
