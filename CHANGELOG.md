# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-12-30

### Added

- Blockquote element styling (`.rm-bq, blockquote`) with border, background, font style, padding options
- Sidebar toggle buttons in preview topbar to hide/show left and right sidebars for more preview space
- Right sidebar is now clickable for direct style editing
- Full preview coverage: all 23 editable elements are now represented and clickable in the preview
  - Blockquote example
  - Query block example
  - Embed block example
  - Table example
  - Page brackets on page links
  - Breadcrumbs navigation
  - External link with icon
  - TODO checkbox

### Changed

- Right sidebar conditionally renders based on toggle state
- Visual feedback on toggle buttons (highlighted when sidebar is hidden)

## [1.1.0] - 2025-12-30

### Added

- 11 new editable Roam elements:
  - Right Sidebar (`#right-sidebar`)
  - Main Content (`.roam-body-main, .roam-article`)
  - Block Container (`.roam-block-container`) - tree lines, indent, padding
  - Query blocks (`.rm-query`)
  - External Links (`a.rm-alias-external`)
  - Page Brackets (`.rm-page-ref-brackets`)
  - TODO Checkbox (`.check-container`)
  - Breadcrumbs (`.rm-zoom`)
  - Embed Container (`.rm-embed-container`)
  - Kanban Board (`.kanban-board`)
  - Table (`.rm-table`)
- Sidebar text styling: color, font size, font weight, letter spacing
- CSS template auto-insertion in Additional Custom CSS textarea (click to insert selector wrapper)
- Comprehensive editable elements documentation in README

### Changed

- Preview mockup now extends to full viewport height with reasonable margins instead of fixed 680px height
- Corrected sidebar CSS selector from `.roam-sidebar` to `.roam-sidebar-container`

## [1.0.0] - 2025-12-25

### Added

- Initial release of Roam Theme Editor
- Color palette presets with light and dark mode variants
- Random palette generation using color harmony algorithms (complementary, analogous, triadic, split-complementary, monochromatic)
- Extract color palettes from uploaded images
- Import color palettes from URLs (Coolors, Adobe Color, ColorHunt)
- Individual color customization with live preview
- WCAG contrast checker with auto-fix suggestions
- Typography customization (fonts, sizes, line height)
- Google Fonts integration
- Click-to-edit element styling in preview
- Undo/redo history with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- Theme import/export as JSON
- CSS export with copy-to-clipboard
- Editor dark mode toggle
- Collapsible editor sidebar
- State persistence in localStorage
- Footer with credits and support links
