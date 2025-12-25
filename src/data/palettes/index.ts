import type { ColorPalette } from '../../types/theme';

export interface PalettePreset {
  id: string;
  name: string;
  light: ColorPalette;
  dark: ColorPalette;
}

// Default Roam-inspired palette
const defaultPreset: PalettePreset = {
  id: 'default',
  name: 'Default',
  light: {
    name: 'Default Light',
    colors: {
      primary: '#137cbd',
      secondary: '#d9822b',
      background: '#ffffff',
      surface: '#f5f8fa',
      text: '#182026',
      textMuted: '#5c7080',
      border: '#d8e1e8',
    },
  },
  dark: {
    name: 'Default Dark',
    colors: {
      primary: '#48aff0',
      secondary: '#ffb366',
      background: '#1c2127',
      surface: '#252a31',
      text: '#f5f8fa',
      textMuted: '#a7b6c2',
      border: '#394b59',
    },
  },
};

// Nord palette - Arctic, north-bluish color scheme
const nordPreset: PalettePreset = {
  id: 'nord',
  name: 'Nord',
  light: {
    name: 'Nord Light',
    colors: {
      primary: '#5e81ac',
      secondary: '#bf616a',
      background: '#eceff4',
      surface: '#e5e9f0',
      text: '#2e3440',
      textMuted: '#4c566a',
      border: '#d8dee9',
    },
  },
  dark: {
    name: 'Nord Dark',
    colors: {
      primary: '#88c0d0',
      secondary: '#bf616a',
      background: '#2e3440',
      surface: '#3b4252',
      text: '#eceff4',
      textMuted: '#d8dee9',
      border: '#4c566a',
    },
  },
};

// Dracula palette - Dark theme with vibrant colors
const draculaPreset: PalettePreset = {
  id: 'dracula',
  name: 'Dracula',
  light: {
    name: 'Dracula Light',
    colors: {
      primary: '#9580ff',
      secondary: '#ff80bf',
      background: '#f8f8f2',
      surface: '#f0f0e8',
      text: '#282a36',
      textMuted: '#6272a4',
      border: '#d0d0c8',
    },
  },
  dark: {
    name: 'Dracula Dark',
    colors: {
      primary: '#bd93f9',
      secondary: '#ff79c6',
      background: '#282a36',
      surface: '#44475a',
      text: '#f8f8f2',
      textMuted: '#6272a4',
      border: '#44475a',
    },
  },
};

// Solarized palette - Precision colors for machines and people
const solarizedPreset: PalettePreset = {
  id: 'solarized',
  name: 'Solarized',
  light: {
    name: 'Solarized Light',
    colors: {
      primary: '#268bd2',
      secondary: '#d33682',
      background: '#fdf6e3',
      surface: '#eee8d5',
      text: '#657b83',
      textMuted: '#93a1a1',
      border: '#eee8d5',
    },
  },
  dark: {
    name: 'Solarized Dark',
    colors: {
      primary: '#268bd2',
      secondary: '#d33682',
      background: '#002b36',
      surface: '#073642',
      text: '#839496',
      textMuted: '#586e75',
      border: '#073642',
    },
  },
};

// Gruvbox palette - Retro groove color scheme
const gruvboxPreset: PalettePreset = {
  id: 'gruvbox',
  name: 'Gruvbox',
  light: {
    name: 'Gruvbox Light',
    colors: {
      primary: '#458588',
      secondary: '#d65d0e',
      background: '#fbf1c7',
      surface: '#ebdbb2',
      text: '#3c3836',
      textMuted: '#665c54',
      border: '#d5c4a1',
    },
  },
  dark: {
    name: 'Gruvbox Dark',
    colors: {
      primary: '#83a598',
      secondary: '#fe8019',
      background: '#282828',
      surface: '#3c3836',
      text: '#ebdbb2',
      textMuted: '#a89984',
      border: '#504945',
    },
  },
};

// One Dark palette - Atom's iconic dark theme
const oneDarkPreset: PalettePreset = {
  id: 'one-dark',
  name: 'One Dark',
  light: {
    name: 'One Light',
    colors: {
      primary: '#4078f2',
      secondary: '#a626a4',
      background: '#fafafa',
      surface: '#f0f0f0',
      text: '#383a42',
      textMuted: '#a0a1a7',
      border: '#e5e5e6',
    },
  },
  dark: {
    name: 'One Dark',
    colors: {
      primary: '#61afef',
      secondary: '#c678dd',
      background: '#282c34',
      surface: '#21252b',
      text: '#abb2bf',
      textMuted: '#5c6370',
      border: '#3e4451',
    },
  },
};

export const palettePresets: PalettePreset[] = [
  defaultPreset,
  nordPreset,
  draculaPreset,
  solarizedPreset,
  gruvboxPreset,
  oneDarkPreset,
];

export const getPaletteById = (id: string): PalettePreset | undefined => {
  return palettePresets.find((p) => p.id === id);
};
