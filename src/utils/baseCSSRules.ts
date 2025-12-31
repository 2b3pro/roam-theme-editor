// Base CSS rules that apply theme variables to Roam elements
// These rules bridge the gap between CSS variables and actual Roam UI elements

export function generateBaseCSSRules(): string {
  return `/* ============================================
   BASE APPLICATION RULES
   Applies theme variables to Roam elements
   ============================================ */

/* Typography - Apply fonts to all text elements */
div,
textarea {
  font-family: var(--main-font);
  font-size: var(--main-font-size);
  line-height: var(--line-height);
}

h1,
h2,
h3,
h4,
h5,
h6,
.rm-level1,
.rm-level2,
.rm-level3 {
  font-family: var(--heading-font);
}

code,
.rm-code-block,
.CodeMirror {
  font-family: var(--code-font);
}

/* Main body and background */
.roam-body {
  background-color: var(--body-bg);
}

.roam-body .roam-app {
  color: var(--main-font-color);
}

.roam-body .roam-app h1 {
  color: var(--main-font-color);
}

/* Main content area */
.roam-body .roam-app .roam-main .roam-article {
  color: var(--main-font-color);
}

/* Topbar */
.roam-topbar {
  background-color: var(--body-bg);
}

/* Left Sidebar */
.roam-body .roam-app .roam-sidebar-container {
  background-color: var(--sidebar-bg);
}

.roam-body .roam-app .roam-sidebar-container .roam-sidebar-content .log-button {
  color: var(--main-font-color);
}

.roam-body .roam-app .roam-sidebar-container .roam-sidebar-content .log-button:hover {
  color: var(--main-font-color);
  background-color: var(--highlight-background-color);
}

.roam-body .roam-app .roam-sidebar-container .roam-sidebar-content .starred-pages-wrapper {
  color: var(--main-font-color);
}

.roam-body .roam-app .roam-sidebar-container .roam-sidebar-content .starred-pages-wrapper .starred-pages .page {
  color: var(--main-font-color);
}

.roam-body .roam-app .roam-sidebar-container .roam-sidebar-content .starred-pages-wrapper .starred-pages .page:hover {
  background-color: var(--highlight-background-color);
}

/* Right Sidebar */
#right-sidebar {
  background-color: var(--sidebar-bg);
}

#right-sidebar > div {
  background-color: var(--sidebar-bg);
}

/* Page Links */
.rm-page-ref-link-color {
  color: var(--page-link-color);
}

.rm-page-ref {
  color: var(--page-link-color);
}

.rm-page-ref:hover {
  text-decoration: underline;
}

/* Page Reference Brackets */
.rm-page-ref-brackets {
  color: var(--page-bracket-color);
}

/* Tags */
.rm-page-ref-tag {
  color: var(--tag-font-color);
  background-color: var(--tag-bg-color);
  border-radius: 4px;
  padding: 1px 4px;
}

.rm-page-ref-tag:hover {
  text-decoration: none;
  filter: brightness(0.95);
}

/* External Links */
a {
  color: var(--page-link-color);
}

a:hover {
  color: var(--page-link-color);
  text-decoration: underline;
}

/* Block References */
.rm-block-ref {
  border-bottom: 1px solid var(--page-bracket-color);
  cursor: alias;
}

.rm-block-ref:hover {
  background-color: var(--highlight-background-color);
}

/* Bullets */
.controls .simple-bullet-outer .simple-bullet-inner {
  background-color: var(--page-link-color);
}

.roam-bullet-closed {
  background-color: var(--page-bracket-color);
}

/* Block Container - Tree lines */
.block-border-left {
  border-left-color: var(--page-bracket-color);
}

/* Highlights */
.roam-highlight {
  background-color: var(--highlight-background-color);
  padding: 2px;
  margin: -2px;
}

/* Checkboxes / TODOs */
.check-container input:checked ~ .checkmark {
  background-color: var(--page-link-color);
}

.checkmark {
  border-color: var(--page-bracket-color);
}

/* Code Blocks */
.rm-code-block {
  background-color: var(--sidebar-bg);
  border-radius: 4px;
}

code {
  background-color: var(--tag-bg-color);
  border-radius: 3px;
  padding: 1px 4px;
}

/* Reference Items (Linked/Unlinked references) */
.rm-reference-item {
  background-color: var(--sidebar-bg);
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  margin-right: 8px;
}

/* Reference Container border */
.rm-reference-container {
  border-top-color: var(--page-bracket-color);
}

/* Block highlight when selected */
.block-highlight-blue {
  background-color: var(--highlight-background-color);
}

/* Query blocks */
.rm-query {
  border: 1px solid var(--page-bracket-color);
  border-radius: 4px;
}

.rm-query .rm-query-title {
  background-color: var(--sidebar-bg);
  color: var(--page-bracket-color);
}

/* Embed container */
.rm-embed-container {
  background-color: var(--tag-bg-color);
  border-left: 3px solid var(--page-link-color);
  padding: 8px;
  border-radius: 4px;
}

/* Kanban board */
.kanban-board {
  background-color: var(--sidebar-bg);
}

.kanban-column {
  background-color: var(--body-bg);
  border-radius: 4px;
}

.kanban-card {
  background-color: var(--sidebar-bg);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Tables */
.roam-table th,
.roam-table td {
  border-color: var(--page-bracket-color);
}

/* Log/Daily notes separator */
.roam-log-container .roam-log-page {
  border-top-color: var(--page-bracket-color);
}

/* Horizontal rule */
.rm-line {
  background-color: var(--page-bracket-color);
}

/* Selected block input styling */
.rm-block-input {
  background-color: var(--highlight-background-color);
  border-radius: 4px;
  padding-left: 4px;
}

/* Scrollbar styling (optional - can be customized) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--page-bracket-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--tag-font-color);
}

/* Headings */
.rm-level1 {
  font-size: 1.8em;
  font-weight: 500;
}

.rm-level2 {
  font-size: 1.4em;
  font-weight: 500;
}

.rm-level3 {
  font-size: 1.2em;
  font-weight: 500;
  color: var(--page-bracket-color);
}

/* Bold and Italic text accents (optional) */
.roam-app strong {
  color: var(--page-link-color);
}

/* Blockquote styling */
.rm-bq,
blockquote {
  border-left: 3px solid var(--page-link-color);
  padding-left: 12px;
  margin-left: 0;
  color: var(--page-bracket-color);
}

/* Find or create dropdown */
.rm-find-or-create-wrapper .rm-menu-item:hover {
  background-color: var(--highlight-background-color);
}

/* Mentions and search */
.rm-mentions-search-items .rm-mentions-search-item {
  background-color: var(--sidebar-bg);
  border-color: var(--page-bracket-color);
}

.rm-mentions-search-items .rm-mentions-search-item:hover {
  background-color: var(--highlight-background-color);
}

/* Block mention */
.block-mention {
  background-color: var(--tag-bg-color);
}

.block-mention:hover {
  background-color: var(--highlight-background-color);
}

/* Page rows (All Pages view) */
.rm-pages-row-highlight {
  background-color: var(--highlight-background-color);
}

/* Popup/Omnibar styling */
.bp3-input {
  background-color: var(--body-bg);
  color: var(--main-font-color);
}

.bp3-menu {
  background-color: var(--body-bg);
  color: var(--main-font-color);
}

.bp3-menu-item:hover {
  background-color: var(--highlight-background-color);
}`;
}
