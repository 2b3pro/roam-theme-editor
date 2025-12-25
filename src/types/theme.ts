export interface ColorPalette {
  name: string;
  colors: {
    primary: string;      // Main accent (links, highlights)
    secondary: string;    // Secondary accent (tags, buttons)
    background: string;   // Main background
    surface: string;      // Cards, sidebar, elevated elements
    text: string;         // Primary text
    textMuted: string;    // Secondary/dimmed text
    border: string;       // Dividers, outlines
  };
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  headingFont: string;
  codeFont: string;
}

export const defaultTypography: TypographySettings = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '16px',
  lineHeight: '1.6',
  headingFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  codeFont: '"SF Mono", "Fira Code", Consolas, monospace',
};

export interface ThemeVariants {
  light: ColorPalette;
  dark: ColorPalette;
  activeMode: 'light' | 'dark' | 'system';
}

export type ThemeMode = 'light' | 'dark' | 'system';

// Common web-safe and popular fonts
export const fontOptions = [
  { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', label: 'System Default' },
  { value: '"Inter", sans-serif', label: 'Inter' },
  { value: '"Roboto", sans-serif', label: 'Roboto' },
  { value: '"Open Sans", sans-serif', label: 'Open Sans' },
  { value: '"Lato", sans-serif', label: 'Lato' },
  { value: '"Source Sans Pro", sans-serif', label: 'Source Sans Pro' },
  { value: '"Nunito", sans-serif', label: 'Nunito' },
  { value: '"Poppins", sans-serif', label: 'Poppins' },
  { value: '"Merriweather", serif', label: 'Merriweather' },
  { value: '"Lora", serif', label: 'Lora' },
  { value: '"Playfair Display", serif', label: 'Playfair Display' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
];

export const codeFontOptions = [
  { value: '"SF Mono", "Fira Code", Consolas, monospace', label: 'System Mono' },
  { value: '"Fira Code", monospace', label: 'Fira Code' },
  { value: '"JetBrains Mono", monospace', label: 'JetBrains Mono' },
  { value: '"Source Code Pro", monospace', label: 'Source Code Pro' },
  { value: '"IBM Plex Mono", monospace', label: 'IBM Plex Mono' },
  { value: 'Consolas, monospace', label: 'Consolas' },
  { value: '"Monaco", monospace', label: 'Monaco' },
];

export const fontSizeOptions = [
  { value: '14px', label: 'Small (14px)' },
  { value: '15px', label: 'Medium-Small (15px)' },
  { value: '16px', label: 'Medium (16px)' },
  { value: '17px', label: 'Medium-Large (17px)' },
  { value: '18px', label: 'Large (18px)' },
  { value: '20px', label: 'Extra Large (20px)' },
];

export const lineHeightOptions = [
  { value: '1.4', label: 'Compact (1.4)' },
  { value: '1.5', label: 'Normal (1.5)' },
  { value: '1.6', label: 'Relaxed (1.6)' },
  { value: '1.75', label: 'Loose (1.75)' },
  { value: '2', label: 'Double (2.0)' },
];
