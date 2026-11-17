import type { Theme } from '@/types/content';

type Palette = Theme['dark'];

const RADIUS: Record<Theme['radius'], string> = {
  none: '0',
  sm: '0.375rem',
  md: '0.625rem',
  lg: '1rem',
  xl: '1.5rem',
};

const paletteVars = (p: Palette, scheme: 'dark' | 'light'): string =>
  [
    `--c-bg:${p.background}`,
    `--c-bg-soft:${p.backgroundSoft}`,
    `--c-surface:${p.surface}`,
    `--c-line:${p.line}`,
    `--c-text:${p.text}`,
    `--c-muted:${p.muted}`,
    `--c-primary:${p.primary}`,
    `--c-secondary:${p.secondary}`,
    `--c-on-primary:${p.onPrimary}`,
    `--glow:${scheme === 'dark' ? '22%' : '12%'}`,
    `color-scheme:${scheme}`,
  ].join(';');

/** Traduce theme.json a CSS. `auto` sigue el modo claro/oscuro del dispositivo. */
export function themeToCss(theme: Theme): string {
  const radius = `--r-theme:${RADIUS[theme.radius]}`;
  if (theme.mode === 'dark') return `:root{${paletteVars(theme.dark, 'dark')};${radius}}`;
  if (theme.mode === 'light') return `:root{${paletteVars(theme.light, 'light')};${radius}}`;
  return (
    `:root{${paletteVars(theme.dark, 'dark')};${radius}}` +
    `@media (prefers-color-scheme: light){:root{${paletteVars(theme.light, 'light')}}}`
  );
}

export function applyTheme(theme: Theme) {
  let el = document.getElementById('theme-vars') as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = 'theme-vars';
    document.head.appendChild(el);
  }
  el.textContent = themeToCss(theme);
}
