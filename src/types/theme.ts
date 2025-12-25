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

export interface ThemeVariants {
  light: ColorPalette;
  dark: ColorPalette;
  activeMode: 'light' | 'dark' | 'system';
}

export type ThemeMode = 'light' | 'dark' | 'system';
