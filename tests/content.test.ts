import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ContentError, validateContent, type RawContent } from '../src/content/validate';
import { loadContent } from '../src/content/loader';
import { themeToCssVars } from '../src/themes/applyTheme';

const read = (rel: string) => JSON.parse(readFileSync(join(process.cwd(), rel), 'utf8'));

function realRaw(): RawContent {
  const pages: Record<string, unknown> = {};
  for (const f of readdirSync(join(process.cwd(), 'content/pages'))) {
    pages[f.replace('.json', '')] = read(`content/pages/${f}`);
  }
  return {
    site: read('content/site.json'),
    navigation: read('content/navigation.json'),
    theme: read('content/theme.json'),
    services: read('content/collections/services.json'),
    testimonials: read('content/collections/testimonials.json'),
    pages,
  };
}

const clone = <T,>(v: T): T => structuredClone(v);

function issuesOf(raw: RawContent): string[] {
  try {
    validateContent(raw);
  } catch (e) {
    if (e instanceof ContentError) return e.issues;
    throw e;
  }
  return [];
}

describe('contenido de ejemplo', () => {
  it('es válido', () => {
    const bundle = validateContent(realRaw());
    expect(bundle.pages.map((p) => p.slug).sort()).toEqual(['about', 'contact', 'home']);
    expect(bundle.services.length).toBeGreaterThan(0);
  });

  it('el cargador de Vite produce el mismo contenido válido', () => {
    const modules: Record<string, unknown> = {
      '/content/site.json': read('content/site.json'),
      '/content/navigation.json': read('content/navigation.json'),
      '/content/theme.json': read('content/theme.json'),
      '/content/collections/services.json': read('content/collections/services.json'),
      '/content/collections/testimonials.json': read('content/collections/testimonials.json'),
      '/content/pages/home.json': read('content/pages/home.json'),
      '/content/pages/about.json': read('content/pages/about.json'),
      '/content/pages/contact.json': read('content/pages/contact.json'),
    };
    expect(loadContent(modules).pages).toHaveLength(3);
  });
});

describe('datos inválidos producen errores claros', () => {
  it('reporta el archivo y el campo cuando falta un dato requerido', () => {
    const raw = realRaw();
    (raw.site as { name?: string }).name = '';
    const issues = issuesOf(raw);
    expect(issues.some((i) => i.includes('content/site.json') && i.includes('name'))).toBe(true);
  });

  it('rechaza un tipo de sección desconocido', () => {
    const raw = clone(realRaw());
    (raw.pages.home as { sections: unknown[] }).sections.push({ type: 'carrusel' });
    expect(issuesOf(raw).some((i) => i.includes('content/pages/home.json'))).toBe(true);
  });

  it('rechaza colores que no son hexadecimales', () => {
    const raw = clone(realRaw());
    (raw.theme as { colors: { primary: string } }).colors.primary = 'azul';
    expect(issuesOf(raw).some((i) => i.includes('theme.json') && i.includes('colors.primary'))).toBe(true);
  });

  it('exige que el slug coincida con el nombre del archivo', () => {
    const raw = clone(realRaw());
    (raw.pages.about as { slug: string }).slug = 'otro';
    expect(issuesOf(raw).some((i) => i.includes('debe coincidir con el nombre del archivo'))).toBe(true);
  });

  it('exige la página home', () => {
    const raw = clone(realRaw());
    delete raw.pages.home;
    expect(issuesOf(raw).some((i) => i.includes('falta la página "home"'))).toBe(true);
  });

  it('detecta enlaces de navegación a páginas inexistentes', () => {
    const raw = clone(realRaw());
    (raw.navigation as { items: { label: string; href: string }[] }).items.push({ label: 'Blog', href: '/blog' });
    expect(issuesOf(raw).some((i) => i.includes('"/blog"'))).toBe(true);
  });

  it('detecta ids duplicados en colecciones', () => {
    const raw = clone(realRaw());
    const items = (raw.services as { items: { id: string }[] }).items;
    items.push({ ...items[0] });
    expect(issuesOf(raw).some((i) => i.includes('id duplicado'))).toBe(true);
  });

  it('rechaza enlaces con formato inválido', () => {
    const raw = clone(realRaw());
    (raw.navigation as { items: { href: string }[] }).items[0].href = 'inicio';
    expect(issuesOf(raw).length).toBeGreaterThan(0);
  });

  it('acumula todos los errores en una sola pasada', () => {
    const raw = clone(realRaw());
    (raw.site as { name?: string }).name = '';
    (raw.theme as { colors: { text: string } }).colors.text = 'x';
    expect(issuesOf(raw).length).toBeGreaterThanOrEqual(2);
  });
});

describe('tema', () => {
  it('convierte theme.json en variables CSS', () => {
    const vars = themeToCssVars(validateContent(realRaw()).theme);
    expect(vars['--c-primary']).toBe('#4f46e5');
    expect(vars['--r-theme']).toBe('0.75rem');
  });
});
