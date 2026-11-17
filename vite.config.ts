import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import type { Plugin } from 'vite';
import { themeToCss } from './src/themes/applyTheme';

/** Inserta en el HTML el CSS generado desde content/theme.json: el tema se ve desde el primer pintado. */
function inlineTheme(): Plugin {
  return {
    name: 'inline-theme',
    transformIndexHtml() {
      const theme = JSON.parse(readFileSync('content/theme.json', 'utf8'));
      return [{ tag: 'style', attrs: { id: 'theme-vars' }, children: themeToCss(theme), injectTo: 'head' }];
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineTheme()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
