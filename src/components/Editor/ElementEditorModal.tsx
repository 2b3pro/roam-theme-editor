import { useState, useEffect, useRef } from 'react';
import type { ElementStyleDefinition, ElementStyleOverride, EditableProperty } from '../../types/elementStyles';

interface ElementEditorModalProps {
  element: ElementStyleDefinition;
  override: ElementStyleOverride | undefined;
  onSave: (override: ElementStyleOverride) => void;
  onClose: () => void;
  paletteColors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
}

type TabType = 'visual' | 'css';

export function ElementEditorModal({
  element,
  override,
  onSave,
  onClose,
  paletteColors,
}: ElementEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [styles, setStyles] = useState<Record<string, string>>(override?.styles || {});
  const [beforeStyles, setBeforeStyles] = useState<Record<string, string>>(override?.beforeStyles || {});
  const [afterStyles, setAfterStyles] = useState<Record<string, string>>(override?.afterStyles || {});
  const [customCSS, setCustomCSS] = useState(override?.customCSS || '');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleStyleChange = (property: string, value: string, pseudo?: 'before' | 'after') => {
    if (pseudo === 'before') {
      setBeforeStyles(prev => ({ ...prev, [property]: value }));
    } else if (pseudo === 'after') {
      setAfterStyles(prev => ({ ...prev, [property]: value }));
    } else {
      setStyles(prev => ({ ...prev, [property]: value }));
    }
  };

  const handleSave = () => {
    onSave({
      elementId: element.id,
      styles,
      beforeStyles: Object.keys(beforeStyles).length > 0 ? beforeStyles : undefined,
      afterStyles: Object.keys(afterStyles).length > 0 ? afterStyles : undefined,
      customCSS: customCSS.trim() || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStyles({});
    setBeforeStyles({});
    setAfterStyles({});
    setCustomCSS('');
  };

  // Generate CSS preview from current styles
  const generatePreviewCSS = () => {
    const styleEntries = Object.entries(styles).filter(([, v]) => v);
    const beforeEntries = Object.entries(beforeStyles).filter(([, v]) => v);
    const afterEntries = Object.entries(afterStyles).filter(([, v]) => v);

    if (styleEntries.length === 0 && beforeEntries.length === 0 && afterEntries.length === 0 && !customCSS.trim()) {
      return `/* No custom styles yet */\n${element.selector} {\n  /* Add your styles here */\n}`;
    }

    const lines: string[] = [];

    // Main styles
    if (styleEntries.length > 0) {
      lines.push(`${element.selector} {`);
      styleEntries.forEach(([prop, value]) => {
        lines.push(`  ${prop}: ${value};`);
      });
      lines.push('}');
    }

    // ::before styles
    if (beforeEntries.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push(`${element.selector}::before {`);
      beforeEntries.forEach(([prop, value]) => {
        if (prop === 'content') {
          lines.push(`  ${prop}: "${value}";`);
        } else {
          lines.push(`  ${prop}: ${value};`);
        }
      });
      lines.push('}');
    }

    // ::after styles
    if (afterEntries.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push(`${element.selector}::after {`);
      afterEntries.forEach(([prop, value]) => {
        if (prop === 'content') {
          lines.push(`  ${prop}: "${value}";`);
        } else {
          lines.push(`  ${prop}: ${value};`);
        }
      });
      lines.push('}');
    }

    if (customCSS.trim()) {
      if (lines.length > 0) lines.push('');
      lines.push('/* Custom CSS */');
      lines.push(customCSS.trim());
    }
    return lines.join('\n');
  };

  // Get the value for a property, considering pseudo-element
  const getPropertyValue = (prop: EditableProperty): string => {
    if (prop.pseudo === 'before') {
      return beforeStyles[prop.cssProperty] || '';
    } else if (prop.pseudo === 'after') {
      return afterStyles[prop.cssProperty] || '';
    }
    return styles[prop.cssProperty] || '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {element.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {element.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'visual'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Visual Editor
            </span>
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'css'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              CSS Editor
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'visual' ? (
            <div className="space-y-4">
              {/* Selector info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  <span className="text-gray-400 dark:text-gray-500">Selector: </span>
                  {element.selector}
                </p>
              </div>

              {/* Property editors */}
              {element.editableProperties.map((prop, index) => (
                <PropertyEditor
                  key={`${prop.cssProperty}-${prop.pseudo || 'main'}-${index}`}
                  property={prop}
                  value={getPropertyValue(prop)}
                  onChange={(value) => handleStyleChange(prop.cssProperty, value, prop.pseudo)}
                  paletteColors={paletteColors}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Generated CSS preview */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Generated CSS (from visual editor)
                </label>
                <pre className="bg-gray-900 dark:bg-black rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                  {generatePreviewCSS()}
                </pre>
              </div>

              {/* Custom CSS editor */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Additional Custom CSS
                </label>
                <textarea
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  placeholder={`/* Add advanced CSS here */\n${element.selector}:hover {\n  /* hover styles */\n}`}
                  className="w-full h-40 px-4 py-3 bg-gray-900 dark:bg-black text-gray-100 font-mono text-sm rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  spellCheck={false}
                />
                <p className="mt-1 text-xs text-gray-400">
                  This CSS will be appended after the visual editor styles.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PropertyEditorProps {
  property: EditableProperty;
  value: string;
  onChange: (value: string) => void;
  paletteColors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
}

// Common emoji suggestions for content
const EMOJI_SUGGESTIONS = ['✨', '🔥', '⭐', '💡', '📌', '🎯', '✅', '❤️', '🚀', '💪', '📚', '🎨'];

function PropertyEditor({ property, value, onChange, paletteColors }: PropertyEditorProps) {
  const { cssProperty, label, type, options, unit, min, max, step, pseudo } = property;

  // Extract numeric value from string (e.g., "16px" -> 16)
  const numericValue = value ? parseFloat(value) : undefined;

  // Get label with pseudo indicator
  const displayLabel = pseudo ? `${label} (::${pseudo})` : label;
  const displayProperty = pseudo ? `::${pseudo} { ${cssProperty} }` : cssProperty;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {displayLabel}
        <span className="ml-2 text-xs font-mono text-gray-400">{displayProperty}</span>
      </label>

      {type === 'color' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          />
          {/* Palette color shortcuts */}
          <div className="flex gap-1">
            {Object.entries(paletteColors).slice(0, 4).map(([key, color]) => (
              <button
                key={key}
                onClick={() => onChange(color)}
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={`Use ${key}: ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {type === 'size' && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={numericValue ?? min ?? 0}
            onChange={(e) => onChange(`${e.target.value}${unit}`)}
            className="flex-1 accent-blue-600"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={numericValue ?? ''}
            onChange={(e) => onChange(e.target.value ? `${e.target.value}${unit}` : '')}
            className="w-20 px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 w-8">{unit}</span>
        </div>
      )}

      {type === 'select' && options && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Default</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'number' && (
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={numericValue ?? ''}
          onChange={(e) => onChange(e.target.value ? `${e.target.value}${unit || ''}` : '')}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      )}

      {type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`e.g., 4px 8px`}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      )}

      {type === 'font' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Font name"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      )}

      {type === 'content' && (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter text or emoji..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {/* Emoji suggestions */}
          <div className="flex flex-wrap gap-1">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onChange(value + emoji)}
                className="w-8 h-8 text-lg rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Click an emoji to append it, or type any text/emoji
          </p>
        </div>
      )}
    </div>
  );
}
