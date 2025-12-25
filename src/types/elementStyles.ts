// Types for per-element CSS customization

export interface ElementStyleDefinition {
  id: string;
  name: string;
  selector: string;
  description: string;
  category: 'text' | 'layout' | 'colors' | 'interactive';
  editableProperties: EditableProperty[];
}

export interface EditableProperty {
  cssProperty: string;
  label: string;
  type: 'color' | 'size' | 'font' | 'select' | 'number' | 'text' | 'content';
  options?: { value: string; label: string }[]; // For select type
  unit?: string; // For size/number types (px, em, %, etc.)
  min?: number;
  max?: number;
  step?: number;
  pseudo?: 'before' | 'after'; // For ::before and ::after content
}

export interface ElementStyleOverride {
  elementId: string;
  styles: Record<string, string>; // cssProperty -> value
  beforeStyles?: Record<string, string>; // ::before pseudo-element styles
  afterStyles?: Record<string, string>; // ::after pseudo-element styles
  customCSS?: string; // Raw CSS for advanced editing
}

// Roam element definitions with their editable properties
export const roamElements: ElementStyleDefinition[] = [
  // Page Title
  {
    id: 'page-title',
    name: 'Page Title',
    selector: '.rm-title-display',
    description: 'The main page title (e.g., daily note date)',
    category: 'text',
    editableProperties: [
      { cssProperty: 'font-size', label: 'Font Size', type: 'size', unit: 'px', min: 16, max: 72, step: 1 },
      { cssProperty: 'font-weight', label: 'Font Weight', type: 'select', options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
      ]},
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
      { cssProperty: 'color', label: 'Color', type: 'color' },
      { cssProperty: 'letter-spacing', label: 'Letter Spacing', type: 'size', unit: 'em', min: -0.1, max: 0.5, step: 0.01 },
    ],
  },
  // Heading 1
  {
    id: 'heading-1',
    name: 'Heading 1',
    selector: '.rm-heading.rm-level1, .roam-body .roam-app h1:not(.rm-title-display)',
    description: 'Level 1 headings in blocks',
    category: 'text',
    editableProperties: [
      { cssProperty: 'font-size', label: 'Font Size', type: 'size', unit: 'em', min: 1, max: 3, step: 0.1 },
      { cssProperty: 'font-weight', label: 'Font Weight', type: 'select', options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
      ]},
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
      { cssProperty: 'color', label: 'Color', type: 'color' },
      { cssProperty: 'margin-bottom', label: 'Margin Bottom', type: 'size', unit: 'px', min: 0, max: 32, step: 1 },
      { cssProperty: 'content', label: 'Prepend Text', type: 'content', pseudo: 'before' },
      { cssProperty: 'content', label: 'Append Text', type: 'content', pseudo: 'after' },
    ],
  },
  // Heading 2
  {
    id: 'heading-2',
    name: 'Heading 2',
    selector: '.rm-heading.rm-level2',
    description: 'Level 2 headings in blocks',
    category: 'text',
    editableProperties: [
      { cssProperty: 'font-size', label: 'Font Size', type: 'size', unit: 'em', min: 1, max: 2.5, step: 0.1 },
      { cssProperty: 'font-weight', label: 'Font Weight', type: 'select', options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
      ]},
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
      { cssProperty: 'color', label: 'Color', type: 'color' },
      { cssProperty: 'content', label: 'Prepend Text', type: 'content', pseudo: 'before' },
      { cssProperty: 'content', label: 'Append Text', type: 'content', pseudo: 'after' },
    ],
  },
  // Heading 3
  {
    id: 'heading-3',
    name: 'Heading 3',
    selector: '.rm-heading.rm-level3',
    description: 'Level 3 headings in blocks',
    category: 'text',
    editableProperties: [
      { cssProperty: 'font-size', label: 'Font Size', type: 'size', unit: 'em', min: 1, max: 2, step: 0.1 },
      { cssProperty: 'font-weight', label: 'Font Weight', type: 'select', options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
      ]},
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
      { cssProperty: 'color', label: 'Color', type: 'color' },
      { cssProperty: 'content', label: 'Prepend Text', type: 'content', pseudo: 'before' },
      { cssProperty: 'content', label: 'Append Text', type: 'content', pseudo: 'after' },
    ],
  },
  // Page Links
  {
    id: 'page-link',
    name: 'Page Link',
    selector: '.rm-page-ref--link',
    description: 'Internal page references [[like this]]',
    category: 'interactive',
    editableProperties: [
      { cssProperty: 'color', label: 'Color', type: 'color' },
      { cssProperty: 'text-decoration', label: 'Text Decoration', type: 'select', options: [
        { value: 'none', label: 'None' },
        { value: 'underline', label: 'Underline' },
        { value: 'underline dotted', label: 'Dotted Underline' },
      ]},
      { cssProperty: 'font-weight', label: 'Font Weight', type: 'select', options: [
        { value: 'inherit', label: 'Inherit' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
      ]},
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
    ],
  },
  // Tags
  {
    id: 'tag',
    name: 'Tag',
    selector: '.rm-page-ref--tag',
    description: 'Tags #like-this',
    category: 'interactive',
    editableProperties: [
      { cssProperty: 'color', label: 'Text Color', type: 'color' },
      { cssProperty: 'background-color', label: 'Background', type: 'color' },
      { cssProperty: 'border-radius', label: 'Border Radius', type: 'size', unit: 'px', min: 0, max: 16, step: 1 },
      { cssProperty: 'padding', label: 'Padding', type: 'text' },
      { cssProperty: 'font-size', label: 'Font Size', type: 'size', unit: 'em', min: 0.7, max: 1.2, step: 0.05 },
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
      { cssProperty: 'content', label: 'Prepend Text', type: 'content', pseudo: 'before' },
      { cssProperty: 'content', label: 'Append Text', type: 'content', pseudo: 'after' },
    ],
  },
  // Code Block
  {
    id: 'code-block',
    name: 'Code Block',
    selector: '.rm-code-block',
    description: 'Multi-line code blocks',
    category: 'colors',
    editableProperties: [
      { cssProperty: 'background-color', label: 'Background', type: 'color' },
      { cssProperty: 'color', label: 'Text Color', type: 'color' },
      { cssProperty: 'border-radius', label: 'Border Radius', type: 'size', unit: 'px', min: 0, max: 16, step: 1 },
      { cssProperty: 'padding', label: 'Padding', type: 'size', unit: 'px', min: 4, max: 24, step: 2 },
      { cssProperty: 'font-size', label: 'Font Size', type: 'size', unit: 'em', min: 0.75, max: 1.1, step: 0.05 },
    ],
  },
  // Inline Code
  {
    id: 'inline-code',
    name: 'Inline Code',
    selector: 'code',
    description: 'Inline code snippets',
    category: 'colors',
    editableProperties: [
      { cssProperty: 'background-color', label: 'Background', type: 'color' },
      { cssProperty: 'color', label: 'Text Color', type: 'color' },
      { cssProperty: 'border-radius', label: 'Border Radius', type: 'size', unit: 'px', min: 0, max: 8, step: 1 },
      { cssProperty: 'padding', label: 'Padding', type: 'text' },
    ],
  },
  // Bullet
  {
    id: 'bullet',
    name: 'Bullet',
    selector: '.rm-bullet',
    description: 'Block bullet points',
    category: 'layout',
    editableProperties: [
      { cssProperty: 'background-color', label: 'Color', type: 'color' },
      { cssProperty: 'width', label: 'Size', type: 'size', unit: 'px', min: 4, max: 12, step: 1 },
      { cssProperty: 'height', label: 'Height', type: 'size', unit: 'px', min: 4, max: 12, step: 1 },
      { cssProperty: 'border-radius', label: 'Border Radius', type: 'size', unit: 'px', min: 0, max: 6, step: 1 },
    ],
  },
  // Block Reference
  {
    id: 'block-ref',
    name: 'Block Reference',
    selector: '.rm-block-ref',
    description: 'Block references ((uid))',
    category: 'interactive',
    editableProperties: [
      { cssProperty: 'background-color', label: 'Background', type: 'color' },
      { cssProperty: 'color', label: 'Text Color', type: 'color' },
      { cssProperty: 'border-radius', label: 'Border Radius', type: 'size', unit: 'px', min: 0, max: 8, step: 1 },
      { cssProperty: 'padding', label: 'Padding', type: 'text' },
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
    ],
  },
  // Sidebar
  {
    id: 'sidebar',
    name: 'Sidebar',
    selector: '.roam-sidebar',
    description: 'Left sidebar panel',
    category: 'layout',
    editableProperties: [
      { cssProperty: 'background-color', label: 'Background', type: 'color' },
      { cssProperty: 'width', label: 'Width', type: 'size', unit: 'px', min: 180, max: 320, step: 10 },
      { cssProperty: 'border-right-color', label: 'Border Color', type: 'color' },
    ],
  },
  // Highlight
  {
    id: 'highlight',
    name: 'Highlight',
    selector: 'mark, .rm-highlight',
    description: 'Highlighted text',
    category: 'colors',
    editableProperties: [
      { cssProperty: 'background-color', label: 'Background', type: 'color' },
      { cssProperty: 'color', label: 'Text Color', type: 'color' },
      { cssProperty: 'padding', label: 'Padding', type: 'text' },
      { cssProperty: 'border-radius', label: 'Border Radius', type: 'size', unit: 'px', min: 0, max: 4, step: 1 },
      { cssProperty: 'font-style', label: 'Font Style', type: 'select', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ]},
    ],
  },
];

// Get element definition by ID
export function getElementById(id: string): ElementStyleDefinition | undefined {
  return roamElements.find(el => el.id === id);
}

// Helper to add pseudo-element to each part of a comma-separated selector
function addPseudoToSelector(selector: string, pseudo: string): string {
  return selector
    .split(',')
    .map(s => s.trim() + pseudo)
    .join(', ');
}

// Generate CSS from element overrides
export function generateElementCSS(overrides: ElementStyleOverride[]): string {
  if (overrides.length === 0) return '';

  const cssRules: string[] = [];

  for (const override of overrides) {
    const element = getElementById(override.elementId);
    if (!element) continue;

    const styleEntries = Object.entries(override.styles).filter(([, v]) => v);

    if (styleEntries.length > 0) {
      const properties = styleEntries
        .map(([prop, value]) => `  ${prop}: ${value};`)
        .join('\n');
      cssRules.push(`${element.selector} {\n${properties}\n}`);
    }

    // Handle ::before pseudo-element
    if (override.beforeStyles) {
      const beforeEntries = Object.entries(override.beforeStyles).filter(([, v]) => v);
      if (beforeEntries.length > 0) {
        const properties = beforeEntries
          .map(([prop, value]) => {
            // Wrap content value in quotes if it's the content property
            if (prop === 'content') {
              return `  ${prop}: "${value}";`;
            }
            return `  ${prop}: ${value};`;
          })
          .join('\n');
        const pseudoSelector = addPseudoToSelector(element.selector, '::before');
        cssRules.push(`${pseudoSelector} {\n${properties}\n}`);
      }
    }

    // Handle ::after pseudo-element
    if (override.afterStyles) {
      const afterEntries = Object.entries(override.afterStyles).filter(([, v]) => v);
      if (afterEntries.length > 0) {
        const properties = afterEntries
          .map(([prop, value]) => {
            // Wrap content value in quotes if it's the content property
            if (prop === 'content') {
              return `  ${prop}: "${value}";`;
            }
            return `  ${prop}: ${value};`;
          })
          .join('\n');
        const pseudoSelector = addPseudoToSelector(element.selector, '::after');
        cssRules.push(`${pseudoSelector} {\n${properties}\n}`);
      }
    }

    if (override.customCSS?.trim()) {
      cssRules.push(override.customCSS.trim());
    }
  }

  return cssRules.join('\n\n');
}
