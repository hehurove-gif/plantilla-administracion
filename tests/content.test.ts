import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ContentError, validateContent, type RawContent } from '../src/content/validate';
import { loadContent } from '../src/content/loader';
import { themeToCss } from '../src/themes/applyTheme';
import { whatsappLink } from '../src/utils/whatsapp';
import { socialNetworks } from '../src/schemas';
import { THEME_STORAGE_KEY, effectiveScheme, nextScheme, readStoredScheme, storeScheme } from '../src/themes/themeMode';

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
    projects: read('content/collections/projects.json'),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

describe('contenido de ejemplo', () => {
  it('es válido', () => {
    const bundle = validateContent(realRaw());
    expect(bundle.pages.map((p) => p.slug).sort()).toEqual(['about', 'contact', 'home']);
    expect(bundle.services.length).toBeGreaterThan(0);
    expect(bundle.projects.length).toBeGreaterThan(0);
  });

  it('los textos de ejemplo siguen el formato "Texto N, sección X"', () => {
    const home = validateContent(realRaw()).pages.find((p) => p.slug === 'home')!;
    const hero = home.sections[0] as Any;
    expect(hero.eyebrow).toBe('Texto 1, sección Hero');
    expect(hero.title).toBe('Texto 2, sección Hero');
  });

  it('el cargador de Vite produce el mismo contenido válido', () => {
    const raw = realRaw();
    const modules: Record<string, unknown> = {
      '/content/site.json': raw.site,
      '/content/navigation.json': raw.navigation,
      '/content/theme.json': raw.theme,
      '/content/collections/services.json': raw.services,
      '/content/collections/projects.json': raw.projects,
      '/content/collections/testimonials.json': raw.testimonials,
    };
    for (const [name, data] of Object.entries(raw.pages)) modules[`/content/pages/${name}.json`] = data;
    expect(loadContent(modules).pages).toHaveLength(3);
  });
});

describe('datos inválidos producen errores claros', () => {
  it('reporta el archivo y el campo cuando falta un dato requerido', () => {
    const raw = realRaw();
    (raw.site as Any).name = '';
    expect(issuesOf(raw).some((i) => i.includes('content/site.json') && i.includes('name'))).toBe(true);
  });

  it('rechaza un tipo de sección desconocido', () => {
    const raw = clone(realRaw());
    (raw.pages.home as Any).sections.push({ type: 'carrusel' });
    expect(issuesOf(raw).some((i) => i.includes('content/pages/home.json'))).toBe(true);
  });

  it('rechaza colores que no son hexadecimales', () => {
    const raw = clone(realRaw());
    (raw.theme as Any).dark.primary = 'azul';
    expect(issuesOf(raw).some((i) => i.includes('theme.json') && i.includes('dark.primary'))).toBe(true);
  });

  it('rechaza un número de WhatsApp con formato inválido, pero acepta vacío', () => {
    const raw = clone(realRaw());
    (raw.site as Any).contact.whatsapp = '+52 55 1234';
    expect(issuesOf(raw).some((i) => i.includes('whatsapp'))).toBe(true);
    (raw.site as Any).contact.whatsapp = '';
    expect(issuesOf(raw)).toEqual([]);
  });

  it('rechaza redes que no tienen ícono disponible', () => {
    const raw = clone(realRaw());
    (raw.site as Any).social.push({ network: 'myspace', url: 'https://myspace.com/x' });
    expect(issuesOf(raw).some((i) => i.includes('social'))).toBe(true);
  });

  it('exige que el slug coincida con el nombre del archivo', () => {
    const raw = clone(realRaw());
    (raw.pages.about as Any).slug = 'otro';
    expect(issuesOf(raw).some((i) => i.includes('debe coincidir con el nombre del archivo'))).toBe(true);
  });

  it('exige la página home', () => {
    const raw = clone(realRaw());
    delete raw.pages.home;
    expect(issuesOf(raw).some((i) => i.includes('falta la página "home"'))).toBe(true);
  });

  it('detecta enlaces de navegación a páginas inexistentes', () => {
    const raw = clone(realRaw());
    (raw.navigation as Any).items.push({ label: 'Blog', href: '/blog' });
    expect(issuesOf(raw).some((i) => i.includes('"/blog"'))).toBe(true);
  });

  it('detecta anclas que no existen en la página', () => {
    const raw = clone(realRaw());
    (raw.navigation as Any).items.push({ label: 'X', href: '/#no-existe' });
    expect(issuesOf(raw).some((i) => i.includes('no-existe'))).toBe(true);
  });

  it('detecta botones con enlaces internos rotos', () => {
    const raw = clone(realRaw());
    (raw.pages.home as Any).sections[0].primaryCta.href = '/nada';
    expect(issuesOf(raw).some((i) => i.includes('"/nada"'))).toBe(true);
  });

  it('detecta ids de sección duplicados', () => {
    const raw = clone(realRaw());
    (raw.pages.home as Any).sections[1].id = 'inicio';
    expect(issuesOf(raw).some((i) => i.includes('id de sección duplicado'))).toBe(true);
  });

  it('detecta ids duplicados en colecciones', () => {
    const raw = clone(realRaw());
    const items = (raw.projects as Any).items;
    items.push({ ...items[0] });
    expect(issuesOf(raw).some((i) => i.includes('id duplicado'))).toBe(true);
  });

  it('rechaza enlaces con formato inválido', () => {
    const raw = clone(realRaw());
    (raw.navigation as Any).items[0].href = 'inicio';
    expect(issuesOf(raw).length).toBeGreaterThan(0);
  });

  it('acumula todos los errores en una sola pasada', () => {
    const raw = clone(realRaw());
    (raw.site as Any).name = '';
    (raw.theme as Any).light.text = 'x';
    expect(issuesOf(raw).length).toBeGreaterThanOrEqual(2);
  });
});

describe('LinkedIn, precios y agendar llamada', () => {
  it('LinkedIn está entre las redes y tiene su ícono', () => {
    const { social } = validateContent(realRaw()).site;
    expect(social.some((x) => x.network === 'linkedin' && x.url.startsWith('https://www.linkedin.com/in/'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'public/social/linkedin.png'))).toBe(true);
  });

  it('todas las redes configurables tienen ícono en public/social', () => {
    for (const n of socialNetworks) expect(existsSync(join(process.cwd(), `public/social/${n}.png`))).toBe(true);
  });

  it('la portada incluye una sección de precios con un plan destacado', () => {
    const home = validateContent(realRaw()).pages.find((p) => p.slug === 'home')!;
    const pricing = home.sections.find((s) => s.type === 'pricing') as Any;
    expect(pricing.plans).toHaveLength(3);
    expect(pricing.plans.filter((p: Any) => p.highlighted)).toHaveLength(1);
  });

  it('detecta botones de plan con enlaces internos rotos', () => {
    const raw = clone(realRaw());
    const pricing = (raw.pages.home as Any).sections.find((s: Any) => s.type === 'pricing');
    pricing.plans[0].cta.href = '/no-existe';
    expect(issuesOf(raw).some((i) => i.includes('"/no-existe"') && i.includes('pricing'))).toBe(true);
  });

  it('rechaza un plan sin precio', () => {
    const raw = clone(realRaw());
    const pricing = (raw.pages.home as Any).sections.find((s: Any) => s.type === 'pricing');
    pricing.plans[0].price = '';
    expect(issuesOf(raw).some((i) => i.includes('home.json'))).toBe(true);
  });

  it('el enlace de agendar acepta https o vacío, pero no otra cosa', () => {
    const raw = clone(realRaw());
    (raw.site as Any).contact.schedulingUrl = 'https://calendly.com/usuario/30min';
    expect(issuesOf(raw)).toEqual([]);
    (raw.site as Any).contact.schedulingUrl = 'calendly.com/usuario';
    expect(issuesOf(raw).some((i) => i.includes('schedulingUrl'))).toBe(true);
  });

  it('acepta el resaltado del título del hero', () => {
    const hero = validateContent(realRaw()).pages.find((p) => p.slug === 'home')!.sections[0] as Any;
    expect(hero.titleHighlight).toContain('Texto 8');
  });
});

describe('GitHub y crédito del pie', () => {
  it('GitHub está entre las redes', () => {
    const { social } = validateContent(realRaw()).site;
    expect(social.some((x) => x.network === 'github' && x.url.startsWith('https://github.com/'))).toBe(true);
  });

  it('el pie incluye el crédito con enlace https', () => {
    const credit = validateContent(realRaw()).site.footer.credit!;
    expect(credit.text).toBe('Developed by');
    expect(credit.name).toBe('Hetor');
    expect(credit.href).toBe('https://hetor.hehurove.workers.dev/es');
  });

  it('el crédito es opcional', () => {
    const raw = clone(realRaw());
    delete (raw.site as Any).footer.credit;
    expect(issuesOf(raw)).toEqual([]);
  });

  it('rechaza un crédito con enlace que no es https', () => {
    const raw = clone(realRaw());
    (raw.site as Any).footer.credit.href = 'http://ejemplo.com';
    expect(issuesOf(raw).some((i) => i.includes('credit.href'))).toBe(true);
  });
});

describe('tema', () => {
  it('modo auto genera oscuro por defecto y claro según el dispositivo', () => {
    const css = themeToCss(validateContent(realRaw()).theme);
    expect(css).toContain('--c-primary:#22d3ee');
    expect(css).toContain('@media (prefers-color-scheme: light)');
    expect(css).toContain('--c-primary:#2a74ad');
  });

  it('modo auto permite elegir tema a mano (data-theme manda sobre el dispositivo)', () => {
    const css = themeToCss(validateContent(realRaw()).theme);
    expect(css).toContain(':root[data-theme="light"]{');
    expect(css).toContain(':root[data-theme="dark"]{');
    expect(css.indexOf(':root[data-theme="light"]')).toBeGreaterThan(css.indexOf('@media (prefers-color-scheme: light)'));
  });

  it('el tema claro usa la paleta de PETCA', () => {
    const { light } = validateContent(realRaw()).theme;
    expect(light).toMatchObject({
      background: '#f1fcfe',
      surface: '#ffffff',
      text: '#1f3b57',
      primary: '#2a74ad',
      line: '#8ecbee',
    });
  });

  it('modo oscuro fijo no incluye la paleta clara', () => {
    const theme = { ...validateContent(realRaw()).theme, mode: 'dark' as const };
    expect(themeToCss(theme)).not.toContain('prefers-color-scheme');
    expect(themeToCss(theme)).not.toContain('data-theme');
  });
});

describe('elección manual de tema', () => {
  const fake = (value: string | null) => ({ getItem: () => value, setItem: () => undefined });

  it('lee solo valores válidos', () => {
    expect(readStoredScheme(fake('light'))).toBe('light');
    expect(readStoredScheme(fake('dark'))).toBe('dark');
    expect(readStoredScheme(fake('azul'))).toBeNull();
    expect(readStoredScheme(fake(null))).toBeNull();
    expect(readStoredScheme(null)).toBeNull();
  });

  it('no falla si el almacenamiento está bloqueado', () => {
    const blocked = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('bloqueado');
      },
    };
    expect(readStoredScheme(blocked)).toBeNull();
    expect(() => storeScheme(blocked, 'dark')).not.toThrow();
  });

  it('guarda con la clave que usa index.html', () => {
    const saved: Record<string, string> = {};
    storeScheme({ getItem: () => null, setItem: (k, v) => void (saved[k] = v) }, 'light');
    expect(saved).toEqual({ theme: 'light' });
    expect(readFileSync(join(process.cwd(), 'index.html'), 'utf8')).toContain(`getItem('${THEME_STORAGE_KEY}')`);
  });

  it('el tema efectivo prioriza la elección sobre el dispositivo', () => {
    expect(effectiveScheme('dark', true)).toBe('dark');
    expect(effectiveScheme('light', false)).toBe('light');
    expect(effectiveScheme(null, true)).toBe('light');
    expect(effectiveScheme(null, false)).toBe('dark');
    expect(nextScheme('dark')).toBe('light');
    expect(nextScheme('light')).toBe('dark');
  });
});

describe('whatsapp', () => {
  it('arma el enlace con el mensaje codificado', () => {
    expect(whatsappLink('5215512345678', 'Hola mundo')).toBe('https://wa.me/5215512345678?text=Hola%20mundo');
  });
  it('devuelve null si el número está vacío o es inválido', () => {
    expect(whatsappLink('')).toBeNull();
    expect(whatsappLink('123')).toBeNull();
  });
});

describe('imágenes y galería', () => {
  const imgs = (raw: Any) => {
    const out: string[] = [];
    const walk = (v: Any) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object')
        for (const [k, x] of Object.entries(v)) {
          if ((k === 'image' || k === 'cover') && typeof x === 'string') out.push(x);
          else walk(x);
        }
    };
    walk(raw);
    return out;
  };

  it('todas las imágenes del contenido de ejemplo existen en public/', () => {
    const raw = realRaw() as Any;
    const list = imgs(raw);
    expect(list.length).toBeGreaterThanOrEqual(15);
    for (const i of list) expect(existsSync(join(process.cwd(), 'public', i)), i).toBe(true);
  });

  it('la galería exige texto alternativo', () => {
    const raw = realRaw() as Any;
    const about = raw.pages.about;
    about.sections.find((s: Any) => s.type === 'gallery').images[0].alt = '';
    expect(() => validateContent(raw)).toThrow(ContentError);
  });

  it('la galería no puede estar vacía', () => {
    const raw = realRaw() as Any;
    const about = raw.pages.about;
    about.sections.find((s: Any) => s.type === 'gallery').images = [];
    expect(() => validateContent(raw)).toThrow(ContentError);
  });
});
