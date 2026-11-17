import type { Theme } from '@/types/content';

const RADIUS: Record<Theme['radius'], string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1.25rem',
};

/** Traduce theme.json a variables CSS. Sin lógica de negocio: solo presentación. */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const c = theme.colors;
  return {
    '--c-primary': c.primary,
    '--c-primary-contrast': c.primaryContrast,
    '--c-background': c.background,
    '--c-surface': c.surface,
    '--c-text': c.text,
    '--c-muted': c.muted,
    '--r-theme': RADIUS[theme.radius],
  };
}

export function applyTheme(theme: Theme, el: HTMLElement = document.documentElement) {
  for (const [k, v] of Object.entries(themeToCssVars(theme))) el.style.setProperty(k, v);
}
