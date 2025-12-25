import type { ColorPalette } from '../../types/theme';

interface RoamMockupProps {
  palette: ColorPalette;
}

export function RoamMockup({ palette }: RoamMockupProps) {
  const { colors } = palette;

  return (
    <div
      className="roam-app rounded-lg overflow-hidden shadow-2xl border"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
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
            className="p-1.5 rounded hover:opacity-80"
            style={{ color: colors.textMuted }}
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
        </div>
      </div>

      <div className="flex h-[520px]">
        {/* Left Sidebar */}
        <div
          className="roam-sidebar w-52 border-r flex flex-col flex-shrink-0"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
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
        </div>

        {/* Main Content */}
        <div className="roam-main flex-1 overflow-auto p-6">
          <div className="max-w-2xl">
            {/* Page Title */}
            <h1
              className="rm-title-display text-2xl font-bold mb-6"
              style={{ color: colors.text }}
            >
              December 25th, 2025
            </h1>

            {/* Blocks */}
            <div className="space-y-2">
              <Block colors={colors}>
                Welcome to the <span className="rm-page-ref--link cursor-pointer hover:underline" style={{ color: colors.primary }}>[[Roam Theme Editor]]</span>!
                This is a preview of how your theme will look.
              </Block>

              <Block colors={colors}>
                Here are some examples of styled elements:
                <div className="pl-6 mt-2 space-y-2">
                  <Block colors={colors} nested>
                    Internal links look <span className="rm-page-ref--link cursor-pointer hover:underline" style={{ color: colors.primary }}>[[like this]]</span>
                  </Block>
                  <Block colors={colors} nested>
                    Tags are styled <span
                      className="rm-page-ref--tag px-1.5 py-0.5 rounded text-sm cursor-pointer"
                      style={{
                        backgroundColor: `${colors.secondary}20`,
                        color: colors.secondary,
                      }}
                    >#like-this</span>
                  </Block>
                  <Block colors={colors} nested>
                    You can have <strong>bold</strong>, <em>italic</em>, and <mark style={{ backgroundColor: `${colors.primary}30`, padding: '0 2px' }}>highlighted</mark> text
                  </Block>
                </div>
              </Block>

              <Block colors={colors}>
                <div className="rm-heading rm-level2 text-xl font-semibold" style={{ color: colors.text }}>
                  Heading Level 2
                </div>
              </Block>

              <Block colors={colors}>
                <div className="rm-heading rm-level3 text-lg font-medium" style={{ color: colors.text }}>
                  Heading Level 3
                </div>
              </Block>

              <Block colors={colors}>
                A block with a <span className="rm-page-ref--link cursor-pointer hover:underline" style={{ color: colors.primary }}>[[page reference]]</span> and
                a <span
                  className="rm-page-ref--tag px-1.5 py-0.5 rounded text-sm cursor-pointer"
                  style={{
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.secondary,
                  }}
                >#tag</span> in the same line.
              </Block>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Linked References */}
        <div
          className="roam-right-sidebar w-64 border-l flex-shrink-0 overflow-auto"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        >
          <div className="p-4">
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
        </div>
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
}

function Block({ children, colors }: BlockProps) {
  return (
    <div className="flex items-start gap-2 group">
      <div
        className="rm-bullet w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
        style={{ backgroundColor: colors.textMuted }}
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
