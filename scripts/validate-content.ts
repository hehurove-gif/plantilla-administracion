import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ContentError, validateContent, type RawContent } from '../src/content/validate';

const root = process.cwd();
const problems: string[] = [];

function readJson(rel: string): unknown {
  const full = join(root, rel);
  if (!existsSync(full)) {
    problems.push(`${rel}: el archivo no existe`);
    return undefined;
  }
  try {
    return JSON.parse(readFileSync(full, 'utf8'));
  } catch (e) {
    problems.push(`${rel}: JSON mal formado (${(e as Error).message})`);
    return undefined;
  }
}

const pages: Record<string, unknown> = {};
const pagesDir = join(root, 'content/pages');
if (existsSync(pagesDir)) {
  for (const file of readdirSync(pagesDir).filter((f) => f.endsWith('.json'))) {
    pages[basename(file, '.json')] = readJson(`content/pages/${file}`);
  }
} else {
  problems.push('content/pages: la carpeta no existe');
}

const raw: RawContent = {
  site: readJson('content/site.json'),
  navigation: readJson('content/navigation.json'),
  theme: readJson('content/theme.json'),
  services: readJson('content/collections/services.json'),
  testimonials: readJson('content/collections/testimonials.json'),
  pages,
};

// Las imágenes locales deben existir en public/
function collectImages(value: unknown, out: Set<string>) {
  if (Array.isArray(value)) value.forEach((v) => collectImages(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'image' && typeof v === 'string' && v.startsWith('/')) out.add(v);
      else collectImages(v, out);
    }
  }
}

try {
  if (problems.length === 0) {
    validateContent(raw);
    const images = new Set<string>();
    collectImages(raw, images);
    for (const img of images) {
      if (!existsSync(join(root, 'public', img))) problems.push(`Imagen no encontrada: public${img}`);
    }
  }
} catch (e) {
  if (e instanceof ContentError) problems.push(...e.issues);
  else throw e;
}

if (problems.length > 0) {
  console.error('\n✗ El contenido no es válido:\n');
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}
console.log('✓ Contenido válido');
