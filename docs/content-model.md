# Modelo de contenido

Los contratos viven en `src/schemas/index.ts` (Zod); los tipos TypeScript se infieren de ahí.

## Convención de textos de ejemplo

Todo texto de ejemplo dice dónde está: **`Texto N, sección X`**. Por ejemplo, «Texto 2, sección Hero» es el campo «Texto 2» del bloque Hero. En Pages CMS los campos se llaman igual («Texto 2 · Título»), así que se puede encontrar qué campo edita cada texto de la página.

- Los elementos de una lista añaden el número entre paréntesis: `Texto 4, sección Servicios (tarjeta 2)`.
- Las páginas distintas de Inicio añaden `, página X` al final.
- Al personalizar un sitio de cliente se reemplazan por el texto real.

## Archivos

- `content/site.json`: nombre, descripción SEO, contacto, WhatsApp (`whatsapp` solo dígitos con código de país; vacío oculta todos los botones de WhatsApp), `schedulingUrl` (Calendly o Google Calendar; vacío oculta el botón «agendar llamada»), `social` (instagram, x, linkedin, github, tiktok, discord) y textos del pie y un `footer.credit` opcional («Developed by Hetor» con enlace; bórralo para ocultarlo en sitios de cliente que no lo quieran).
- `content/navigation.json`: `items[{label, href}]`. Acepta rutas (`/about`) y anclas (`/#servicios`); ambas se validan.
- `content/theme.json`: `mode` (`auto|dark|light`), paletas `dark` y `light` (hex) y `radius`. En `auto` sigue el modo del dispositivo y el encabezado muestra un botón sol/luna para cambiarlo (se recuerda en el navegador); `dark` o `light` fijan el tema y ocultan el botón. La paleta clara por defecto es la de PETCA (azul y durazno); el naranja de acento es `#c46f12`, del propio PETCA, porque el durazno claro no se lee como texto.
- `content/collections/services.json`, `projects.json`, `testimonials.json`: `items[]` con `id` único. Las secciones los **referencian** (no duplican datos).
- `content/pages/<slug>.json`: `slug` (igual al nombre del archivo; `home` = `/`), `title`, `description?`, `sections[]`.

## Secciones (`type`)

Todas aceptan `id` (ancla, ej. `servicios` → `/#servicios`) y `eyebrow` (etiqueta pequeña sobre el título).

| type | Campos propios |
| --- | --- |
| `hero` | `title`, `titleHighlight?` (palabra resaltada con degradado), `subtitle?`, `image?`, `primaryCta?`, `secondaryCta?`, `showWhatsapp`, `tagsLabel?`, `tags[]` |
| `services` | `title`, `intro?`, `limit?` (colección de servicios) |
| `projects` | `title`, `intro?`, `limit?`, `visitLabel` (colección de proyectos) |
| `pricing` | `title`, `intro?`, `plans[{name, description?, price, period?, features[], highlighted, cta?}]` |
| `process` | `title`, `steps[{title,text}]` |
| `text` | `title?`, `paragraphs[]`, `image?` |
| `testimonials` | `title`, `limit?` (colección de testimonios) |
| `faq` | `title`, `items[{question,answer}]` |
| `cta` | `title`, `text?`, `button?`, `showWhatsapp`, `showSchedule` |
| `contact` | `title`, `intro?`, `showWhatsapp`, `showSchedule`, `showSocial` (datos de `site.json`) |

## Redes e íconos

Los íconos están en `public/social/<red>.png` (whatsapp, instagram, x, linkedin, github, tiktok, discord). WhatsApp se genera desde `site.contact.whatsapp`; las demás, desde `site.social`. Para ocultar una red, quítala de la lista.

Íconos disponibles en servicios: `code`, `palette`, `chart`, `shield`, `rocket`, `chat`, `bolt`, `mobile`, `settings`. Los íconos de LinkedIn y GitHub son glifos de Bootstrap Icons (MIT): LinkedIn en azul y GitHub en blanco sobre cuadrado negro. Si prefieres los oficiales, reemplaza `public/social/linkedin.png` o `github.png` conservando el nombre.

## Origen de algunas secciones

Precios, resaltado del título, botón de agendar llamada y los íconos `bolt`/`mobile`/`settings` se tomaron como idea de una plantilla de referencia (VibeCoding). **No** se trajo su formulario de contacto, panel admin, PayPal, Resend ni Google Sheets, porque requieren backend, fuera del alcance del MVP. El botón de cada plan puede apuntar a un enlace externo (por ejemplo, un PayPal.me o WhatsApp).

## Validaciones adicionales

Slug = nombre de archivo, existe `home`, ids de colección y de sección únicos, enlaces internos (menú, botones y planes de precios) apuntan a páginas y anclas existentes, colecciones no vacías si se usan, e imágenes locales existentes en `public/` (script).

## Agregar un tipo de sección

1. Esquema en `src/schemas/index.ts` y agregarlo a `sectionSchema`.
2. Componente en `src/components/sections/`.
3. Caso en `SectionRenderer.tsx` (TypeScript marca error si falta).
4. Bloque en `.pages.yml` y esta tabla; añadir pruebas.
