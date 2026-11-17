import type { z } from 'zod';
import {
  navigationSchema,
  pageSchema,
  servicesCollectionSchema,
  siteSchema,
  testimonialsCollectionSchema,
  themeSchema,
} from '@/schemas';
import type { ContentBundle } from '@/types/content';

/** Contenido sin validar, tal como sale de los archivos JSON. */
export interface RawContent {
  site: unknown;
  navigation: unknown;
  theme: unknown;
  services: unknown;
  testimonials: unknown;
  /** Clave: nombre de archivo sin extensión (ej. "home", "about"). */
  pages: Record<string, unknown>;
}

export class ContentError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`Contenido inválido:\n${issues.map((i) => `  - ${i}`).join('\n')}`);
    this.name = 'ContentError';
    this.issues = issues;
  }
}

export const routeForSlug = (slug: string) => (slug === 'home' ? '/' : `/${slug}`);

function parse<T extends z.ZodType>(schema: T, data: unknown, file: string, issues: string[]): z.infer<T> | undefined {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    const where = issue.path.length ? issue.path.join('.') : '(raíz)';
    issues.push(`${file} → ${where}: ${issue.message}`);
  }
  return undefined;
}

/** Valida todo el contenido y las referencias cruzadas. Lanza ContentError con todos los problemas. */
export function validateContent(raw: RawContent): ContentBundle {
  const issues: string[] = [];

  const site = parse(siteSchema, raw.site, 'content/site.json', issues);
  const navigation = parse(navigationSchema, raw.navigation, 'content/navigation.json', issues);
  const theme = parse(themeSchema, raw.theme, 'content/theme.json', issues);
  const services = parse(servicesCollectionSchema, raw.services, 'content/collections/services.json', issues);
  const testimonials = parse(
    testimonialsCollectionSchema,
    raw.testimonials,
    'content/collections/testimonials.json',
    issues,
  );

  const pages: ContentBundle['pages'] = [];
  for (const [name, data] of Object.entries(raw.pages)) {
    const file = `content/pages/${name}.json`;
    const page = parse(pageSchema, data, file, issues);
    if (!page) continue;
    if (page.slug !== name) {
      issues.push(`${file} → slug: debe coincidir con el nombre del archivo ("${name}"), pero es "${page.slug}"`);
    }
    pages.push(page);
  }

  if (!pages.some((p) => p.slug === 'home')) {
    issues.push('content/pages/home.json: falta la página "home" (ruta "/")');
  }

  // Ids únicos por colección
  for (const [label, items] of [
    ['services', services?.items],
    ['testimonials', testimonials?.items],
  ] as const) {
    const seen = new Set<string>();
    for (const item of items ?? []) {
      if (seen.has(item.id)) issues.push(`content/collections/${label}.json → id duplicado: "${item.id}"`);
      seen.add(item.id);
    }
  }

  // Los enlaces internos de la navegación deben apuntar a páginas existentes
  const routes = new Set(pages.map((p) => routeForSlug(p.slug)));
  for (const item of navigation?.items ?? []) {
    if (item.href.startsWith('/') && !routes.has(item.href)) {
      issues.push(`content/navigation.json → "${item.label}": la ruta "${item.href}" no corresponde a ninguna página`);
    }
  }

  // Las secciones que usan colecciones no deben quedar vacías
  for (const page of pages) {
    for (const section of page.sections) {
      if (section.type === 'services' && services && services.items.length === 0) {
        issues.push(`content/pages/${page.slug}.json: la sección "services" no tiene servicios en la colección`);
      }
      if (section.type === 'testimonials' && testimonials && testimonials.items.length === 0) {
        issues.push(`content/pages/${page.slug}.json: la sección "testimonials" no tiene testimonios en la colección`);
      }
    }
  }

  if (issues.length > 0 || !site || !navigation || !theme || !services || !testimonials) {
    throw new ContentError(issues);
  }

  return {
    site,
    navigation,
    theme,
    services: services.items,
    testimonials: testimonials.items,
    pages,
  };
}
