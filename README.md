# Plantilla Jamstack (Fases 1 + 2)

Plantilla web reutilizable: **React + TypeScript + Vite + Tailwind**, con el contenido en archivos JSON versionados en Git y validado con **Zod**. Sin base de datos ni backend.

> Estado: Fase 1 (núcleo React) y Fase 2 (contenido desacoplado y validación). Aún **no** incluye Pages CMS (Fase 3), GitHub Actions (Fase 4) ni analítica (Fase 5).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local |
| `npm run validate` | Valida `content/` (falla con errores claros) |
| `npm test` | Pruebas de esquemas y validaciones |
| `npm run typecheck` | Revisa tipos |
| `npm run build` | Valida + compila a `dist/` |

## Cloudflare

`wrangler.jsonc` sirve `dist/` como SPA. Deploy command: `npx wrangler deploy`. Build command: `npm run build`.

## Textos de ejemplo

Los textos dicen dónde están: `Texto 1, sección Hero`. En Pages CMS el campo se llama «Texto 1 · …», así sabes qué editar. Detalle en `docs/content-model.md`.

## Estructura

```
content/            Fuente única de contenido (JSON)
  site.json, navigation.json, theme.json
  pages/*.json      Una página por archivo (slug = nombre de archivo; home = "/")
  collections/      services.json, projects.json, testimonials.json
public/social/      Íconos de redes (WhatsApp, Instagram, X, LinkedIn, TikTok, Discord)
src/
  schemas/          Esquemas Zod (contrato del contenido)
  content/          validate.ts (puro) + loader.ts (import.meta.glob)
  components/       ui/, layout/, sections/ (+ SectionRenderer)
  themes/           theme.json -> variables CSS
scripts/            validate-content.ts
tests/              Vitest
docs/               content-model.md
```

## Cómo se edita el contenido

1. Cambia un JSON en `content/` (sin tocar componentes React).
2. `npm run validate` indica archivo y campo ante cualquier error.
3. Para una página nueva: crea `content/pages/<slug>.json` y agrégala a `navigation.json`.

Ver `docs/content-model.md` para los tipos de sección.
