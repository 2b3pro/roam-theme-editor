import { useState, useMemo, useEffect } from 'react';
import { RoamMockup } from './components/Preview/RoamMockup';
import { ColorPicker } from './components/Editor/ColorPicker';
import { palettePresets, getPaletteById } from './data/palettes';
import { generateRandomPalette, harmonyDescriptions, hexToHue, type ColorHarmony } from './utils/colorGenerator';
import type { ColorPalette, ThemeMode } from './types/theme';

const STORAGE_KEY = 'roam-theme-editor-state';
const HARMONY_OPTIONS: ColorHarmony[] = ['complementary', 'analogous', 'triadic', 'split-complementary', 'monochromatic'];

interface SavedState {
  selectedPresetId: string;
  mode: ThemeMode;
  lightPalette: ColorPalette;
  darkPalette: ColorPalette;
}

function App() {
  const [selectedPresetId, setSelectedPresetId] = useState('default');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [lightPalette, setLightPalette] = useState<ColorPalette>(
    palettePresets[0].light
  );
  const [darkPalette, setDarkPalette] = useState<ColorPalette>(
    palettePresets[0].dark
  );
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedHarmony, setSelectedHarmony] = useState<ColorHarmony>('complementary');
  const [baseColor, setBaseColor] = useState('#3b82f6');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: SavedState = JSON.parse(saved);
        setSelectedPresetId(state.selectedPresetId);
        setMode(state.mode);
        setLightPalette(state.lightPalette);
        setDarkPalette(state.darkPalette);
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const state: SavedState = {
        selectedPresetId,
        mode,
        lightPalette,
        darkPalette,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [selectedPresetId, mode, lightPalette, darkPalette]);

  // Handle palette preset selection
  const handlePresetChange = (presetId: string) => {
    const preset = getPaletteById(presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setLightPalette(preset.light);
      setDarkPalette(preset.dark);
    }
  };

  // Handle random palette generation
  const handleRandomize = (useBaseColor: boolean = true) => {
    const hue = useBaseColor ? hexToHue(baseColor) : undefined;
    const newLight = generateRandomPalette(selectedHarmony, false, hue);
    const newDark = generateRandomPalette(selectedHarmony, true, hue);
    setLightPalette(newLight);
    setDarkPalette(newDark);
    setSelectedPresetId('custom');
  };

  // Determine active palette based on mode
  const activePalette = useMemo(() => {
    if (mode === 'dark') return darkPalette;
    if (mode === 'light') return lightPalette;
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
    setSelectedPresetId('custom');
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
          <div className="lg:col-span-1 space-y-6">
            {/* Palette Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Color Palette
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {palettePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      selectedPresetId === preset.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-0.5 mb-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.light.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.light.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.dark.colors.primary }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
              {selectedPresetId === 'custom' && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Custom colors (modified from preset)
                </p>
              )}

              {/* Randomize Section */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Generate Palette
                </h3>

                {/* Base Color */}
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Base Color
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Harmony Selection */}
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedHarmony}
                    onChange={(e) => setSelectedHarmony(e.target.value as ColorHarmony)}
                    className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {HARMONY_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h.charAt(0).toUpperCase() + h.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {harmonyDescriptions[selectedHarmony]}
                </p>

                {/* Generate Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRandomize(true)}
                    className="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    From Base
                  </button>
                  <button
                    onClick={() => handleRandomize(false)}
                    className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Random
                  </button>
                </div>
              </div>
            </div>

            {/* Color Pickers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Colors ({mode === 'system' ? 'Editing Light' : mode.charAt(0).toUpperCase() + mode.slice(1)})
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
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                How to use your theme
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                <li>Choose a palette or customize colors</li>
                <li>Click "Copy CSS" to copy the theme</li>
                <li>In Roam, go to <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[[roam/css]]</code></li>
                <li>Create a code block and paste the CSS</li>
              </ol>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            {/* Toggle between Preview and Code */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {showCode ? 'CSS Output' : 'Preview'}
              </h2>
              <button
                onClick={() => setShowCode(!showCode)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
              >
                {showCode ? 'Show Preview' : 'Show CSS'}
              </button>
            </div>

            {showCode ? (
              <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-[600px]">
                <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                  {generateCSS()}
                </pre>
              </div>
            ) : (
              <RoamMockup palette={activePalette} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
