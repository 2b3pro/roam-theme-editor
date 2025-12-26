import { useState, useMemo, useEffect, useCallback } from 'react';
import { RoamMockup } from './components/Preview/RoamMockup';
import { ColorPicker } from './components/Editor/ColorPicker';
import { ContrastChecker } from './components/Editor/ContrastChecker';
import { TypographyPanel } from './components/Editor/TypographyPanel';
import { ImagePaletteExtractor } from './components/Editor/ImagePaletteExtractor';
import { UrlPaletteImporter } from './components/Editor/UrlPaletteImporter';
import { ElementEditorModal } from './components/Editor/ElementEditorModal';
import { Footer } from './components/Footer';
import { useThemeHistory, useUndoRedoShortcuts } from './hooks/useHistory';
import { palettePresets, getPaletteById } from './data/palettes';
import { generateRandomPalette, harmonyDescriptions, hexToHue, type ColorHarmony } from './utils/colorGenerator';
import type { ColorPalette, ThemeMode, TypographySettings } from './types/theme';
import { defaultTypography } from './types/theme';
import type { ElementStyleOverride } from './types/elementStyles';
import { getElementById, generateElementCSS } from './types/elementStyles';

const STORAGE_KEY = 'roam-theme-editor-state';
const HARMONY_OPTIONS: ColorHarmony[] = ['complementary', 'analogous', 'triadic', 'split-complementary', 'monochromatic'];

type EditorTab = 'palette' | 'colors' | 'contrast' | 'fonts';

interface SavedState {
  selectedPresetId: string;
  mode: ThemeMode;
  lightPalette: ColorPalette;
  darkPalette: ColorPalette;
  typography?: TypographySettings;
}

interface ThemeFile {
  version: string;
  name: string;
  lightPalette: ColorPalette;
  darkPalette: ColorPalette;
  typography: TypographySettings;
  exportedAt: string;
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
  const [activeTab, setActiveTab] = useState<EditorTab>('palette');
  const [typography, setTypography] = useState<TypographySettings>(defaultTypography);
  const [editorDarkMode, setEditorDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roam-theme-editor-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [elementOverrides, setElementOverrides] = useState<ElementStyleOverride[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Apply dark mode class to document
  useEffect(() => {
    if (editorDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('roam-theme-editor-dark-mode', String(editorDarkMode));
  }, [editorDarkMode]);

  // Undo/Redo history
  const { pushSnapshot, undo, redo, canUndo, canRedo } = useThemeHistory();

  const handleUndo = useCallback(() => {
    const snapshot = undo();
    if (snapshot) {
      setLightPalette(snapshot.lightPalette);
      setDarkPalette(snapshot.darkPalette);
      setTypography(snapshot.typography);
      setSelectedPresetId('custom');
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const snapshot = redo();
    if (snapshot) {
      setLightPalette(snapshot.lightPalette);
      setDarkPalette(snapshot.darkPalette);
      setTypography(snapshot.typography);
      setSelectedPresetId('custom');
    }
  }, [redo]);

  // Keyboard shortcuts for undo/redo
  useUndoRedoShortcuts(handleUndo, handleRedo);

  // Push snapshots when theme changes
  useEffect(() => {
    pushSnapshot({ lightPalette, darkPalette, typography });
  }, [lightPalette, darkPalette, typography, pushSnapshot]);

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
        if (state.typography) setTypography(state.typography);
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
        typography,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [selectedPresetId, mode, lightPalette, darkPalette, typography]);

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

  // Element click handler for opening the editor modal
  const handleElementClick = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
  }, []);

  // Save element style override
  const handleElementSave = useCallback((override: ElementStyleOverride) => {
    setElementOverrides((prev) => {
      const existing = prev.findIndex((o) => o.elementId === override.elementId);
      if (existing >= 0) {
        // Check if override is empty (no styles, no pseudo-element styles, and no custom CSS)
        const hasStyles = Object.values(override.styles).some((v) => v);
        const hasBeforeStyles = override.beforeStyles && Object.values(override.beforeStyles).some((v) => v);
        const hasAfterStyles = override.afterStyles && Object.values(override.afterStyles).some((v) => v);
        const hasCustomCSS = override.customCSS?.trim();
        if (!hasStyles && !hasBeforeStyles && !hasAfterStyles && !hasCustomCSS) {
          // Remove the override if it's empty
          return prev.filter((_, i) => i !== existing);
        }
        // Update existing
        const updated = [...prev];
        updated[existing] = override;
        return updated;
      }
      // Add new
      return [...prev, override];
    });
  }, []);

  // Get the selected element definition
  const selectedElement = selectedElementId ? getElementById(selectedElementId) : null;
  const selectedOverride = elementOverrides.find((o) => o.elementId === selectedElementId);

  // Extract Google Font names from font-family strings
  const getGoogleFonts = () => {
    const fonts: string[] = [];
    const extractFont = (fontFamily: string) => {
      const match = fontFamily.match(/"([^"]+)"/);
      if (match && !['SF Mono', 'Times New Roman', 'Segoe UI'].includes(match[1])) {
        return match[1];
      }
      return null;
    };

    const bodyFont = extractFont(typography.fontFamily);
    const headingFont = extractFont(typography.headingFont);
    const codeFont = extractFont(typography.codeFont);

    if (bodyFont) fonts.push(bodyFont);
    if (headingFont && headingFont !== bodyFont) fonts.push(headingFont);
    if (codeFont) fonts.push(codeFont);

    return fonts;
  };

  // Generate CSS output
  const generateCSS = () => {
    const googleFonts = getGoogleFonts();
    const fontImport = googleFonts.length > 0
      ? `/* Google Fonts */\n@import url('https://fonts.googleapis.com/css2?${googleFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&')}&display=swap');\n\n`
      : '';

    const typographyCSS = `  /* Typography */
  --main-font: ${typography.fontFamily};
  --main-font-size: ${typography.fontSize};
  --line-height: ${typography.lineHeight};
  --heading-font: ${typography.headingFont};
  --code-font: ${typography.codeFont};`;

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
${typographyCSS}
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
${typographyCSS}
}`;

    // Add element-specific overrides
    const elementCSS = generateElementCSS(elementOverrides);
    const elementSection = elementCSS ? '\n\n/* Element-specific styles */\n' + elementCSS : '';

    if (mode === 'light') return fontImport + lightCSS + elementSection;
    if (mode === 'dark') return fontImport + darkCSS + elementSection;

    const systemModeCSS = `${fontImport}/* Roam Theme - Auto Light/Dark */

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
${typographyCSS}
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
${typographyCSS}
  }
}`;

    return systemModeCSS + elementSection;
  };

  const handleCopyCSS = async () => {
    const css = generateCSS();
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download theme as JSON
  const handleDownloadTheme = () => {
    const themeData: ThemeFile = {
      version: '1.0',
      name: lightPalette.name || 'Custom Theme',
      lightPalette,
      darkPalette,
      typography,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roam-theme-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download CSS file
  const handleDownloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roam-theme-${Date.now()}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Upload theme from JSON
  const handleUploadTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const themeData: ThemeFile = JSON.parse(content);

        // Validate theme structure
        if (themeData.lightPalette?.colors && themeData.darkPalette?.colors) {
          setLightPalette(themeData.lightPalette);
          setDarkPalette(themeData.darkPalette);
          if (themeData.typography) {
            setTypography(themeData.typography);
          }
          setSelectedPresetId('custom');
        } else {
          alert('Invalid theme file format');
        }
      } catch (err) {
        alert('Failed to parse theme file');
        console.error('Theme import error:', err);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-uploaded
    event.target.value = '';
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
            {/* Undo/Redo Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`p-2 rounded-lg transition-colors ${
                  canUndo
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={`p-2 rounded-lg transition-colors ${
                  canRedo
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg transition-colors ${
                sidebarCollapsed
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Show editor panel' : 'Hide editor panel'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            {/* Editor Dark Mode Toggle */}
            <button
              onClick={() => setEditorDarkMode(!editorDarkMode)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={editorDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {editorDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

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

            {/* Upload Theme */}
            <label className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleUploadTheme}
                className="hidden"
              />
            </label>

            {/* Download Menu */}
            <div className="relative group">
              <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={handleDownloadTheme}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Theme (.json)
                </button>
                <button
                  onClick={handleDownloadCSS}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  CSS File (.css)
                </button>
              </div>
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
      <main className={`mx-auto px-6 py-8 transition-all ${sidebarCollapsed ? 'max-w-5xl' : 'max-w-7xl'}`}>
        <div className={`grid gap-8 ${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Editor Panel */}
          <div className={`lg:col-span-1 space-y-4 transition-all ${sidebarCollapsed ? 'hidden' : ''}`}>
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {([
                  { id: 'palette', label: 'Palette', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
                  { id: 'colors', label: 'Colors', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
                  { id: 'contrast', label: 'Contrast', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'fonts', label: 'Fonts', icon: 'M4 6h16M4 12h8m-8 6h16' },
                ] as { id: EditorTab; label: string; icon: string }[]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {/* Palette Tab */}
                {activeTab === 'palette' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {palettePresets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetChange(preset.id)}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            selectedPresetId === preset.id
                              ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
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
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Custom colors (modified from preset)
                      </p>
                    )}

                    {/* Generate Palette */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Generate Palette
                      </h3>

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

                      <select
                        value={selectedHarmony}
                        onChange={(e) => setSelectedHarmony(e.target.value as ColorHarmony)}
                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                      >
                        {HARMONY_OPTIONS.map((h) => (
                          <option key={h} value={h}>
                            {h.charAt(0).toUpperCase() + h.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {harmonyDescriptions[selectedHarmony]}
                      </p>

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

                    {/* Extract from Image */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <ImagePaletteExtractor
                        onApplyPalette={(light, dark) => {
                          setLightPalette(light);
                          setDarkPalette(dark);
                          setSelectedPresetId('custom');
                        }}
                      />
                    </div>

                    {/* Import from URL */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <UrlPaletteImporter
                        onApplyPalette={(light, dark) => {
                          setLightPalette(light);
                          setDarkPalette(dark);
                          setSelectedPresetId('custom');
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Editing {mode === 'system' ? 'Light' : mode.charAt(0).toUpperCase() + mode.slice(1)} mode
                    </p>
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
                    {mode === 'system' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                        Switch to Light or Dark mode to edit individual palettes.
                      </p>
                    )}
                  </div>
                )}

                {/* Contrast Tab */}
                {activeTab === 'contrast' && (
                  <ContrastChecker
                    palette={currentPalette}
                    onFixColor={(key, value) => {
                      updateColor(key, value);
                    }}
                  />
                )}

                {/* Fonts Tab */}
                {activeTab === 'fonts' && (
                  <TypographyPanel
                    typography={typography}
                    onChange={setTypography}
                  />
                )}
              </div>
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
              <div className="relative">
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg px-2 py-1 shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Click elements to edit</span>
                  {elementOverrides.length > 0 && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                      {elementOverrides.length} customized
                    </span>
                  )}
                </div>
                <RoamMockup
                  palette={activePalette}
                  typography={typography}
                  onElementClick={handleElementClick}
                  elementOverrides={elementOverrides}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Element Editor Modal */}
      {selectedElement && (
        <ElementEditorModal
          element={selectedElement}
          override={selectedOverride}
          onSave={handleElementSave}
          onClose={() => setSelectedElementId(null)}
          paletteColors={activePalette.colors}
        />
      )}
    </div>
  );
}

export default App;
