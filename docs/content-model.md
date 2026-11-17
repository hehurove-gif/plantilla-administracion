# Modelo de contenido

Los contratos viven en `src/schemas/index.ts` (Zod); los tipos TypeScript se infieren de ahí.

## Archivos

- `content/site.json`: nombre, descripción, contacto (única fuente de datos de contacto), redes y pie.
- `content/navigation.json`: `items[{label, href}]`. Los enlaces internos deben existir como página.
- `content/theme.json`: colores hexadecimales y `radius` (`none|sm|md|lg|xl`). Se aplican como variables CSS.
- `content/collections/services.json` y `testimonials.json`: `items[]` con `id` único. Las secciones los **referencian** (no duplican datos).
- `content/pages/<slug>.json`: `slug` (igual al nombre del archivo; `home` = `/`), `title`, `description?`, `sections[]`.

## Secciones (`type`)

| type | Campos |
| --- | --- |
| `hero` | `title`, `subtitle?`, `image?`, `primaryCta?`, `secondaryCta?` |
| `services` | `title`, `intro?`, `limit?` (usa la colección de servicios) |
| `testimonials` | `title`, `limit?` (usa la colección de testimonios) |
| `text` | `title?`, `paragraphs[]` |
| `cta` | `title`, `text?`, `button{label,href}` |
| `contact` | `title`, `intro?` (muestra los datos de `site.json`) |

## Validaciones adicionales

Slug = nombre de archivo, existe `home`, ids únicos, navegación apunta a páginas reales, colecciones no vacías si se usan, e imágenes locales existentes en `public/` (script).

## Agregar un tipo de sección

1. Esquema en `src/schemas/index.ts` y agregarlo a `sectionSchema`.
2. Componente en `src/components/sections/`.
3. Caso en `SectionRenderer.tsx` (TypeScript marca error si falta).
4. Actualizar este documento y añadir pruebas.
