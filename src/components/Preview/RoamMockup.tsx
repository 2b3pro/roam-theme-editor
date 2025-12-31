import { useEffect, useState, useMemo } from 'react';
import type { ColorPalette, TypographySettings } from '../../types/theme';
import { defaultTypography } from '../../types/theme';
import type { ElementStyleOverride } from '../../types/elementStyles';
import { generateElementCSS } from '../../types/elementStyles';

interface RoamMockupProps {
  palette: ColorPalette;
  typography?: TypographySettings;
  onElementClick?: (elementId: string) => void;
  elementOverrides?: ElementStyleOverride[];
}

// Extract Google Font names and load them dynamically
function useGoogleFonts(typography: TypographySettings) {
  useEffect(() => {
    const extractFont = (fontFamily: string): string | null => {
      const match = fontFamily.match(/"([^"]+)"/);
      if (match && !['SF Mono', 'Times New Roman', 'Segoe UI'].includes(match[1])) {
        return match[1];
      }
      return null;
    };

    const fonts = new Set<string>();
    const bodyFont = extractFont(typography.fontFamily);
    const headingFont = extractFont(typography.headingFont);
    const codeFont = extractFont(typography.codeFont);

    if (bodyFont) fonts.add(bodyFont);
    if (headingFont) fonts.add(headingFont);
    if (codeFont) fonts.add(codeFont);

    if (fonts.size === 0) return;

    // Create or update Google Fonts link
    const linkId = 'google-fonts-preview';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    const fontQuery = Array.from(fonts)
      .map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`)
      .join('&');
    const href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    link.href = href;
  }, [typography.fontFamily, typography.headingFont, typography.codeFont]);
}

// Clickable element wrapper with hover indicator
interface ClickableElementProps {
  elementId: string;
  children: React.ReactNode;
  onClick?: (elementId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
}

function ClickableElement({ elementId, children, onClick, className = '', style, inline }: ClickableElementProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!onClick) {
    return inline ? (
      <span className={className} style={style}>{children}</span>
    ) : (
      <div className={className} style={style}>{children}</div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(elementId);
  };

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      className={`${className} cursor-pointer transition-all duration-150`}
      style={{
        ...style,
        outline: isHovered ? '2px solid #3b82f6' : 'none',
        outlineOffset: '2px',
        borderRadius: isHovered ? '4px' : undefined,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click to edit styles"
    >
      {children}
      {isHovered && (
        <span
          className="absolute -top-6 left-0 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-medium rounded whitespace-nowrap z-10"
          style={{ position: 'absolute' }}
        >
          Edit {elementId.replace(/-/g, ' ')}
        </span>
      )}
    </Tag>
  );
}

export function RoamMockup({
  palette,
  typography = defaultTypography,
  onElementClick,
  elementOverrides = [],
}: RoamMockupProps) {
  const { colors } = palette;
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // Load Google Fonts dynamically
  useGoogleFonts(typography);

  // Generate CSS for pseudo-elements (::before, ::after) that can't be applied inline
  const elementCSS = useMemo(() => {
    return generateElementCSS(elementOverrides);
  }, [elementOverrides]);

  // Get override styles for an element
  const getOverrideStyles = (elementId: string): React.CSSProperties => {
    const override = elementOverrides.find(o => o.elementId === elementId);
    if (!override) return {};

    const styles: React.CSSProperties = {};
    for (const [key, value] of Object.entries(override.styles)) {
      if (value) {
        // Convert CSS property to camelCase for React
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        (styles as Record<string, string>)[camelKey] = value;
      }
    }
    return styles;
  };

  return (
    <div
      className="roam-app rounded-lg overflow-hidden shadow-2xl border"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      }}
    >
      {/* Inject element CSS for pseudo-elements */}
      {elementCSS && <style>{elementCSS}</style>}

      {/* Top Toolbar */}
      <div
        className="roam-topbar flex items-center justify-between px-4 py-2 border-b"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="p-1.5 rounded hover:opacity-80 transition-colors"
            style={{
              color: showLeftSidebar ? colors.textMuted : colors.primary,
              backgroundColor: showLeftSidebar ? 'transparent' : `${colors.primary}15`,
            }}
            title={showLeftSidebar ? 'Hide left sidebar' : 'Show left sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-medium" style={{ color: colors.text }}>Daily Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Find or Create Page</span>
          </div>
          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="p-1.5 rounded hover:opacity-80 transition-colors"
            style={{
              color: showRightSidebar ? colors.textMuted : colors.primary,
              backgroundColor: showRightSidebar ? 'transparent' : `${colors.primary}15`,
            }}
            title={showRightSidebar ? 'Hide right sidebar' : 'Show right sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-16rem)]">
        {/* Left Sidebar */}
        {showLeftSidebar && (
          <ClickableElement
            elementId="sidebar"
            onClick={onElementClick}
            className="roam-sidebar-container w-52 border-r flex flex-col flex-shrink-0"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              ...getOverrideStyles('sidebar'),
            }}
          >
            <div className="p-3 space-y-1">
              <SidebarItem icon="📅" label="Daily Notes" active colors={colors} />
              <SidebarItem icon="🔍" label="Graph Overview" colors={colors} />
              <SidebarItem icon="⭐" label="Shortcuts" colors={colors} />
            </div>
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide" style={{ color: colors.textMuted }}>
              Shortcuts
            </div>
            <div className="px-3 space-y-1 flex-1">
              <SidebarItem label="Project Ideas" colors={colors} />
              <SidebarItem label="Reading List" colors={colors} />
              <SidebarItem label="Weekly Review" colors={colors} />
            </div>
          </ClickableElement>
        )}

        {/* Main Content */}
        <ClickableElement
          elementId="main-content"
          onClick={onElementClick}
          className="roam-body-main flex-1 overflow-auto p-6"
          style={{
            backgroundColor: colors.background,
            ...getOverrideStyles('main-content'),
          }}
        >
          <div className="max-w-2xl">
            {/* Breadcrumbs */}
            <ClickableElement
              elementId="breadcrumbs"
              onClick={onElementClick}
              className="rm-zoom flex items-center gap-1 text-xs mb-2 relative"
              style={{
                color: colors.textMuted,
                ...getOverrideStyles('breadcrumbs'),
              }}
            >
              <span>Daily Notes</span>
              <span style={{ opacity: 0.5 }}>/</span>
              <span style={{ color: colors.text }}>December 2025</span>
            </ClickableElement>

            {/* Page Title */}
            <ClickableElement
              elementId="page-title"
              onClick={onElementClick}
              className="rm-title-display text-2xl font-bold mb-6 relative"
              style={{
                color: colors.text,
                fontFamily: typography.headingFont,
                ...getOverrideStyles('page-title'),
              }}
            >
              December 25th, 2025
            </ClickableElement>

            {/* Blocks */}
            <div className="space-y-2">
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                Welcome to the{' '}
                <span className="inline-flex items-center">
                  <ClickableElement
                    elementId="page-brackets"
                    onClick={onElementClick}
                    inline
                    className="rm-page-ref-brackets relative"
                    style={{ color: colors.textMuted, ...getOverrideStyles('page-brackets') }}
                  >
                    [[
                  </ClickableElement>
                  <ClickableElement
                    elementId="page-link"
                    onClick={onElementClick}
                    inline
                    className="rm-page-ref--link cursor-pointer hover:underline relative"
                    style={{ color: colors.primary, ...getOverrideStyles('page-link') }}
                  >
                    Roam Theme Editor
                  </ClickableElement>
                  <span className="rm-page-ref-brackets" style={{ color: colors.textMuted, ...getOverrideStyles('page-brackets') }}>]]</span>
                </span>
                ! This is a preview of how your theme will look.
              </Block>

              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                Here are some examples of styled elements:
                <div className="pl-6 mt-2 space-y-2">
                  <Block colors={colors} nested onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                    Internal links look{' '}
                    <span className="rm-page-ref--link cursor-pointer hover:underline" style={{ color: colors.primary, ...getOverrideStyles('page-link') }}>
                      [[like this]]
                    </span>
                  </Block>
                  <Block colors={colors} nested onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                    Tags are styled{' '}
                    <ClickableElement
                      elementId="tag"
                      onClick={onElementClick}
                      inline
                      className="rm-page-ref--tag px-1.5 py-0.5 rounded text-sm cursor-pointer relative"
                      style={{
                        backgroundColor: `${colors.secondary}20`,
                        color: colors.secondary,
                        ...getOverrideStyles('tag'),
                      }}
                    >
                      #like-this
                    </ClickableElement>
                  </Block>
                  <Block colors={colors} nested onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                    You can have <strong>bold</strong>, <em>italic</em>, and{' '}
                    <ClickableElement
                      elementId="highlight"
                      onClick={onElementClick}
                      inline
                      className="relative"
                      style={{
                        backgroundColor: `${colors.primary}30`,
                        padding: '0 2px',
                        ...getOverrideStyles('highlight'),
                      }}
                    >
                      highlighted
                    </ClickableElement>{' '}
                    text
                  </Block>
                </div>
              </Block>

              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <ClickableElement
                  elementId="heading-1"
                  onClick={onElementClick}
                  className="rm-heading rm-level1 text-2xl font-semibold relative"
                  style={{
                    color: colors.text,
                    fontFamily: typography.headingFont,
                    ...getOverrideStyles('heading-1'),
                  }}
                >
                  Heading Level 1
                </ClickableElement>
              </Block>

              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <ClickableElement
                  elementId="heading-2"
                  onClick={onElementClick}
                  className="rm-heading rm-level2 text-xl font-semibold relative"
                  style={{
                    color: colors.text,
                    fontFamily: typography.headingFont,
                    ...getOverrideStyles('heading-2'),
                  }}
                >
                  Heading Level 2
                </ClickableElement>
              </Block>

              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <ClickableElement
                  elementId="heading-3"
                  onClick={onElementClick}
                  className="rm-heading rm-level3 text-lg font-medium relative"
                  style={{
                    color: colors.text,
                    fontFamily: typography.headingFont,
                    ...getOverrideStyles('heading-3'),
                  }}
                >
                  Heading Level 3
                </ClickableElement>
              </Block>

              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                A block with a{' '}
                <span className="rm-page-ref--link cursor-pointer hover:underline" style={{ color: colors.primary, ...getOverrideStyles('page-link') }}>
                  [[page reference]]
                </span>{' '}
                and a{' '}
                <span
                  className="rm-page-ref--tag px-1.5 py-0.5 rounded text-sm cursor-pointer"
                  style={{
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.secondary,
                    ...getOverrideStyles('tag'),
                  }}
                >
                  #tag
                </span>{' '}
                in the same line.
              </Block>

              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                Inline code:{' '}
                <ClickableElement
                  elementId="inline-code"
                  onClick={onElementClick}
                  inline
                  className="px-1.5 py-0.5 rounded text-sm relative"
                  style={{
                    fontFamily: typography.codeFont,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    ...getOverrideStyles('inline-code'),
                  }}
                >
                  const theme = "custom"
                </ClickableElement>
              </Block>

              {/* Code Block */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <ClickableElement
                  elementId="code-block"
                  onClick={onElementClick}
                  className="rm-code-block rounded-md p-3 mt-1 overflow-x-auto relative"
                  style={{
                    backgroundColor: colors.surface,
                    fontFamily: typography.codeFont,
                    fontSize: '0.875em',
                    ...getOverrideStyles('code-block'),
                  }}
                >
                  <pre style={{ margin: 0, color: colors.text }}>
                    <code>{`function greet(name) {
  return \`Hello, \${name}!\`;
}

greet("Roam");`}</code>
                  </pre>
                </ClickableElement>
              </Block>

              {/* External Link */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                External link:{' '}
                <ClickableElement
                  elementId="external-link"
                  onClick={onElementClick}
                  inline
                  className="rm-alias-external inline-flex items-center gap-1 hover:underline relative"
                  style={{ color: colors.primary, ...getOverrideStyles('external-link') }}
                >
                  https://roamresearch.com
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </ClickableElement>
              </Block>

              {/* TODO Item */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <span className="inline-flex items-center gap-2">
                  <ClickableElement
                    elementId="todo-checkbox"
                    onClick={onElementClick}
                    inline
                    className="check-container w-4 h-4 rounded border-2 flex-shrink-0 relative"
                    style={{
                      borderColor: colors.textMuted,
                      ...getOverrideStyles('todo-checkbox'),
                    }}
                  >
                    <span></span>
                  </ClickableElement>
                  <span>{'{{[[TODO]]}}'} Review theme settings</span>
                </span>
              </Block>

              {/* Block Reference */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                See also:{' '}
                <ClickableElement
                  elementId="block-ref"
                  onClick={onElementClick}
                  inline
                  className="rm-block-ref px-1 rounded cursor-pointer hover:bg-opacity-50 relative"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.text,
                    ...getOverrideStyles('block-ref'),
                  }}
                >
                  ((referenced block))
                </ClickableElement>
              </Block>

              {/* Embed */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                Embedded content:
                <ClickableElement
                  elementId="embed"
                  onClick={onElementClick}
                  className="rm-embed-container mt-2 pl-3 py-2 border-l-2 relative"
                  style={{
                    borderLeftColor: colors.primary,
                    backgroundColor: `${colors.surface}80`,
                    ...getOverrideStyles('embed'),
                  }}
                >
                  <div className="text-sm" style={{ color: colors.text }}>
                    This is an embedded block from another page
                  </div>
                </ClickableElement>
              </Block>

              {/* Query */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <ClickableElement
                  elementId="query"
                  onClick={onElementClick}
                  className="rm-query mt-1 p-3 rounded-lg border relative"
                  style={{
                    backgroundColor: `${colors.surface}50`,
                    borderColor: colors.border,
                    ...getOverrideStyles('query'),
                  }}
                >
                  <div className="text-xs font-medium mb-2" style={{ color: colors.textMuted }}>
                    {'{{query: {and: [[TODO]] [[Project]]}}}'}
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>
                    2 results
                  </div>
                </ClickableElement>
              </Block>

              {/* Table */}
              <Block colors={colors} onElementClick={onElementClick} overrideStyles={getOverrideStyles('bullet')}>
                <ClickableElement
                  elementId="table"
                  onClick={onElementClick}
                  className="rm-table mt-1 overflow-hidden rounded relative"
                  style={{
                    ...getOverrideStyles('table'),
                  }}
                >
                  <table className="w-full text-sm" style={{ borderColor: colors.border }}>
                    <thead>
                      <tr style={{ backgroundColor: colors.surface }}>
                        <th className="px-3 py-1.5 text-left border-b" style={{ borderColor: colors.border, color: colors.text }}>Name</th>
                        <th className="px-3 py-1.5 text-left border-b" style={{ borderColor: colors.border, color: colors.text }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-1.5 border-b" style={{ borderColor: colors.border, color: colors.text }}>Task A</td>
                        <td className="px-3 py-1.5 border-b" style={{ borderColor: colors.border, color: colors.textMuted }}>Done</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5" style={{ color: colors.text }}>Task B</td>
                        <td className="px-3 py-1.5" style={{ color: colors.textMuted }}>In Progress</td>
                      </tr>
                    </tbody>
                  </table>
                </ClickableElement>
              </Block>
            </div>
          </div>
        </ClickableElement>

        {/* Right Sidebar - Linked References */}
        {showRightSidebar && (
          <ClickableElement
            elementId="right-sidebar"
            onClick={onElementClick}
            className="w-64 border-l flex-shrink-0 overflow-auto"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              ...getOverrideStyles('right-sidebar'),
            }}
          >
            <div id="right-sidebar" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
                  Linked References
                </h3>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.surface, color: colors.textMuted }}>
                  3
                </span>
              </div>

              {/* Reference items */}
              <div className="space-y-3">
                <ReferenceItem
                  title="Project Ideas"
                  content="Check out the [[Roam Theme Editor]] for customizing..."
                  colors={colors}
                />
                <ReferenceItem
                  title="December 24th, 2025"
                  content="Started working on theme customization with..."
                  colors={colors}
                />
                <ReferenceItem
                  title="Weekly Review"
                  content="Need to finish the [[Roam Theme Editor]] project"
                  colors={colors}
                />
              </div>

              <div className="mt-6 flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
                  Unlinked References
                </h3>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.surface, color: colors.textMuted }}>
                  1
                </span>
              </div>
              <div
                className="text-xs p-2 rounded"
                style={{ backgroundColor: colors.surface, color: colors.textMuted }}
              >
                <span style={{ color: colors.text }}>Reading List</span>
                <p className="mt-1 opacity-75">...theme editor tools and resources...</p>
              </div>
            </div>
          </ClickableElement>
        )}
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon?: string;
  label: string;
  active?: boolean;
  colors: ColorPalette['colors'];
}

function SidebarItem({ icon, label, active, colors }: SidebarItemProps) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors"
      style={{
        backgroundColor: active ? `${colors.primary}15` : 'transparent',
        color: active ? colors.primary : colors.text,
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  );
}

interface ReferenceItemProps {
  title: string;
  content: string;
  colors: ColorPalette['colors'];
}

function ReferenceItem({ title, content, colors }: ReferenceItemProps) {
  return (
    <div
      className="p-2 rounded text-xs"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="font-medium mb-1" style={{ color: colors.primary }}>
        {title}
      </div>
      <div className="flex items-start gap-1.5">
        <div
          className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
          style={{ backgroundColor: colors.textMuted }}
        />
        <span style={{ color: colors.text }}>{content}</span>
      </div>
    </div>
  );
}

interface BlockProps {
  children: React.ReactNode;
  colors: ColorPalette['colors'];
  nested?: boolean;
  onElementClick?: (elementId: string) => void;
  overrideStyles?: React.CSSProperties;
}

function Block({ children, colors, onElementClick, overrideStyles = {} }: BlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  const bulletStyle: React.CSSProperties = {
    backgroundColor: colors.textMuted,
    ...overrideStyles,
  };

  return (
    <div className="flex items-start gap-2 group">
      <div
        className="rm-bullet w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 cursor-pointer transition-all"
        style={{
          ...bulletStyle,
          outline: isHovered ? '2px solid #3b82f6' : 'none',
          outlineOffset: '2px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onElementClick?.('bullet');
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click to edit bullet styles"
      />
      <div
        className="flex-1 leading-relaxed"
        style={{ color: colors.text }}
      >
        {children}
      </div>
    </div>
  );
}

export default RoamMockup;
