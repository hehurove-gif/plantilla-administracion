import type { z } from 'zod';
import {
  navigationSchema,
  pageSchema,
  projectsCollectionSchema,
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
  projects: unknown;
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
  const projects = parse(projectsCollectionSchema, raw.projects, 'content/collections/projects.json', issues);
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
    ['projects', projects?.items],
    ['testimonials', testimonials?.items],
  ] as const) {
    const seen = new Set<string>();
    for (const item of items ?? []) {
      if (seen.has(item.id)) issues.push(`content/collections/${label}.json → id duplicado: "${item.id}"`);
      seen.add(item.id);
    }
  }

  // Los enlaces internos (en navegación y botones) deben apuntar a páginas y anclas existentes
  const routes = new Set(pages.map((p) => routeForSlug(p.slug)));
  const anchorsByRoute = new Map(
    pages.map((p) => [routeForSlug(p.slug), new Set(p.sections.flatMap((s) => (s.id ? [s.id] : [])))]),
  );
  const checkInternal = (where: string, to: string) => {
    if (!to.startsWith('/')) return;
    const [path, anchor] = to.split('#');
    if (!routes.has(path)) {
      issues.push(`${where}: la ruta "${path}" no corresponde a ninguna página`);
    } else if (anchor && !anchorsByRoute.get(path)?.has(anchor)) {
      issues.push(`${where}: la página "${path}" no tiene ninguna sección con id "${anchor}"`);
    }
  };
  for (const item of navigation?.items ?? []) checkInternal(`content/navigation.json → "${item.label}"`, item.href);
  for (const page of pages) {
    const where = `content/pages/${page.slug}.json`;
    const ids = new Set<string>();
    for (const section of page.sections) {
      if (section.id) {
        if (ids.has(section.id)) issues.push(`${where}: id de sección duplicado "${section.id}"`);
        ids.add(section.id);
      }
      if (section.type === 'hero') {
        if (section.primaryCta) checkInternal(`${where} → hero`, section.primaryCta.href);
        if (section.secondaryCta) checkInternal(`${where} → hero`, section.secondaryCta.href);
      }
      if (section.type === 'cta' && section.button) checkInternal(`${where} → cta`, section.button.href);
    }
  }

  // Las secciones que usan colecciones no deben quedar vacías
  for (const page of pages) {
    for (const section of page.sections) {
      if (section.type === 'services' && services && services.items.length === 0) {
        issues.push(`content/pages/${page.slug}.json: la sección "services" no tiene servicios en la colección`);
      }
      if (section.type === 'projects' && projects && projects.items.length === 0) {
        issues.push(`content/pages/${page.slug}.json: la sección "projects" no tiene proyectos en la colección`);
      }
      if (section.type === 'testimonials' && testimonials && testimonials.items.length === 0) {
        issues.push(`content/pages/${page.slug}.json: la sección "testimonials" no tiene testimonios en la colección`);
      }
    }
  }

  if (issues.length > 0 || !site || !navigation || !theme || !services || !projects || !testimonials) {
    throw new ContentError(issues);
  }

  return {
    site,
    navigation,
    theme,
    services: services.items,
    projects: projects.items,
    testimonials: testimonials.items,
    pages,
  };
}
