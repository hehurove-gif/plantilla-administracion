import { validateContent, type RawContent } from './validate';
import type { ContentBundle } from '@/types/content';

// Vite incluye los JSON en el bundle en tiempo de compilación (sin servidor ni API).
const files = import.meta.glob('/content/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

const PAGE_RE = /^\/content\/pages\/([^/]+)\.json$/;

export function collectRaw(modules: Record<string, unknown>): RawContent {
  const pages: Record<string, unknown> = {};
  for (const [path, data] of Object.entries(modules)) {
    const match = PAGE_RE.exec(path);
    if (match) pages[match[1]] = data;
  }
  return {
    site: modules['/content/site.json'],
    navigation: modules['/content/navigation.json'],
    theme: modules['/content/theme.json'],
    services: modules['/content/collections/services.json'],
    projects: modules['/content/collections/projects.json'],
    testimonials: modules['/content/collections/testimonials.json'],
    pages,
  };
}

export function loadContent(modules: Record<string, unknown> = files): ContentBundle {
  return validateContent(collectRaw(modules));
}

/** Contenido ya validado, listo para usar en la app. */
export const content: ContentBundle = loadContent();
