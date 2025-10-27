import { vars } from 'nativewind';

export const themes = {
  default: {
    light: vars({
      '--color-primary': '59 130 246', // blue-500
      '--color-primary-foreground': '255 255 255', // white
      '--color-secondary': '148 163 184', // slate-400
      '--color-secondary-foreground': '15 23 42', // slate-900
      '--color-background': '255 255 255', // white
      '--color-foreground': '15 23 42', // slate-900
      '--color-card': '255 255 255', // white
      '--color-card-foreground': '15 23 42', // slate-900
      '--color-muted': '241 245 249', // slate-100
      '--color-muted-foreground': '100 116 139', // slate-500
      '--color-border': '226 232 240', // slate-200
      '--color-input': '226 232 240', // slate-200
      '--color-ring': '59 130 246', // blue-500
    }),
    dark: vars({
      '--color-primary': '59 130 246', // blue-500
      '--color-primary-foreground': '255 255 255', // white
      '--color-secondary': '71 85 105', // slate-600
      '--color-secondary-foreground': '248 250 252', // slate-50
      '--color-background': '15 23 42', // slate-900
      '--color-foreground': '248 250 252', // slate-50
      '--color-card': '30 41 59', // slate-800
      '--color-card-foreground': '248 250 252', // slate-50
      '--color-muted': '51 65 85', // slate-700
      '--color-muted-foreground': '148 163 184', // slate-400
      '--color-border': '51 65 85', // slate-700
      '--color-input': '51 65 85', // slate-700
      '--color-ring': '59 130 246', // blue-500
    }),
  },
  purple: {
    light: vars({
      '--color-primary': '168 85 247', // purple-500
      '--color-primary-foreground': '255 255 255', // white
      '--color-secondary': '192 132 252', // purple-400
      '--color-secondary-foreground': '88 28 135', // purple-900
      '--color-background': '250 245 255', // purple-50
      '--color-foreground': '88 28 135', // purple-900
      '--color-card': '255 255 255', // white
      '--color-card-foreground': '88 28 135', // purple-900
      '--color-muted': '243 232 255', // purple-100
      '--color-muted-foreground': '107 33 168', // purple-800
      '--color-border': '233 213 255', // purple-200
      '--color-input': '233 213 255', // purple-200
      '--color-ring': '168 85 247', // purple-500
    }),
    dark: vars({
      '--color-primary': '168 85 247', // purple-500
      '--color-primary-foreground': '255 255 255', // white
      '--color-secondary': '147 51 234', // purple-600
      '--color-secondary-foreground': '250 245 255', // purple-50
      '--color-background': '88 28 135', // purple-900
      '--color-foreground': '250 245 255', // purple-50
      '--color-card': '107 33 168', // purple-800
      '--color-card-foreground': '250 245 255', // purple-50
      '--color-muted': '126 34 206', // purple-700
      '--color-muted-foreground': '233 213 255', // purple-200
      '--color-border': '126 34 206', // purple-700
      '--color-input': '126 34 206', // purple-700
      '--color-ring': '168 85 247', // purple-500
    }),
  },
};

export type ThemeName = keyof typeof themes;
export type ColorScheme = 'light' | 'dark';
