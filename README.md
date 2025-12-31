# Roam Theme Editor

A visual theme editor for [Roam Research](https://roamresearch.com) that lets you create, customize, and preview CSS themes without writing code.

## Features

- **Visual Color Palette Editor** - Choose from preset palettes (Nord, Dracula, Solarized, etc.) or create your own
- **Color Harmony Generator** - Auto-generate palettes using complementary, analogous, triadic, and other color schemes
- **Image Palette Extraction** - Upload an image to extract a matching color palette
- **URL Palette Import** - Import palettes from Coolors URLs
- **Typography Controls** - Customize fonts, sizes, and line heights with Google Fonts integration
- **Live Preview** - See your theme changes in real-time on a representative Roam interface
- **Element-Level Editing** - Click any element in the preview to customize its specific styles
- **Light/Dark/System Modes** - Create themes for light mode, dark mode, or auto-switching based on system preference
- **Contrast Checker** - WCAG accessibility validation for text/background combinations
- **Undo/Redo** - Full history support with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Export Options** - Copy CSS to clipboard or download as .css/.json files

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/2b3pro/roam-theme-editor.git
cd roam-theme-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## How to Use

### 1. Choose a Color Palette

- Select a **preset palette** from the Palette tab (Nord, Dracula, Solarized, etc.)
- Or **generate a palette** by picking a base color and harmony type
- Or **extract colors from an image** by uploading a photo
- Or **import from Coolors** by pasting a Coolors URL

### 2. Customize Colors

Switch to the **Colors tab** to fine-tune individual colors:
- Primary (links, highlights)
- Secondary (tags)
- Background
- Surface (sidebar, cards)
- Text & Text Muted
- Borders

### 3. Adjust Typography

In the **Fonts tab**, customize:
- Body font family
- Heading font
- Code font
- Font sizes and line heights

### 4. Edit Individual Elements

Click on any element in the **Preview** panel to open the element editor:
- Adjust element-specific styles (colors, sizes, spacing)
- Add prepend/append text or emojis (e.g., add icons before headings)
- Write custom CSS for advanced styling

#### Editable Elements

The theme editor supports styling for 22 Roam elements across 4 categories:

**Text Elements**
| Element | CSS Selector | What You Can Customize |
|---------|--------------|------------------------|
| Page Title | `.rm-title-display` | Font size, weight, style, color, letter spacing |
| Heading 1 | `.rm-heading.rm-level1` | Font size, weight, style, color, prepend/append text |
| Heading 2 | `.rm-heading.rm-level2` | Font size, weight, style, color, prepend/append text |
| Heading 3 | `.rm-heading.rm-level3` | Font size, weight, style, color, prepend/append text |
| Page Brackets | `.rm-page-ref-brackets` | Color, opacity, font size |
| Breadcrumbs | `.rm-zoom` | Text color, font size, opacity |

**Layout Elements**
| Element | CSS Selector | What You Can Customize |
|---------|--------------|------------------------|
| Left Sidebar | `.roam-sidebar-container` | Background, width, border, text color, font size/weight |
| Right Sidebar | `#right-sidebar` | Background, width, border, text color, font size |
| Main Content | `.roam-body-main` | Background, max width, padding |
| Block Container | `.roam-block-container` | Tree line color/width, indent, padding |
| Bullet | `.rm-bullet` | Color, size, border radius |
| Embed | `.rm-embed-container` | Background, border, padding, border radius |
| Kanban Board | `.kanban-board` | Column background, border radius, padding |
| Table | `.rm-table` | Background, border color, font size |

**Interactive Elements**
| Element | CSS Selector | What You Can Customize |
|---------|--------------|------------------------|
| Page Link | `.rm-page-ref--link` | Color, text decoration, font weight/style |
| Tag | `.rm-page-ref--tag` | Text/background color, border radius, padding, prepend/append |
| Block Reference | `.rm-block-ref` | Background, text color, border radius, padding |
| External Link | `a.rm-alias-external` | Color, text decoration, font style |
| Query | `.rm-query` | Background, border, border radius, padding |
| TODO Checkbox | `.check-container` | Checkbox color, border, background |

**Color Elements**
| Element | CSS Selector | What You Can Customize |
|---------|--------------|------------------------|
| Code Block | `.rm-code-block` | Background, text color, border radius, padding, font size |
| Inline Code | `code` | Background, text color, border radius, padding |
| Highlight | `.rm-highlight` | Background, text color, padding, border radius |

### 5. Check Accessibility

Use the **Contrast tab** to verify your color choices meet WCAG accessibility standards.

### 6. Export Your Theme

- Click **Copy CSS** to copy the generated CSS to your clipboard
- Or use the **Export** dropdown to download as CSS or JSON

### 7. Apply to Roam

1. In Roam Research, navigate to `[[roam/css]]`
2. Create a new code block with `css` language
3. Paste your copied CSS
4. Your theme is now active!

## Theme Modes

- **Light Mode** - Generates CSS for light backgrounds
- **Dark Mode** - Generates CSS for dark backgrounds
- **System Mode** - Generates CSS with `@media (prefers-color-scheme)` queries for automatic switching

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Escape` | Close modal |

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS 4
- Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

If you find this tool useful, consider supporting its development:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Me-ff5f5f?logo=ko-fi&logoColor=white)](https://ko-fi.com/2b3pro)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-00457C?logo=paypal&logoColor=white)](https://paypal.me/2b3/5)

---

**[View on GitHub](https://github.com/2b3pro/roam-theme-editor)** | Made with love for the Roam community
