# Publicación y vistas previas (Fase 4)

## Dos formas de publicar

**Directa (por defecto).** Pages CMS guarda en `main`. Cloudflare construye y publica solo. Sirve para cambios pequeños del cliente.

**Con revisión.** Los cambios van a una rama y se abre un Pull Request. Antes de fusionar hay validación automática y una vista previa. Sirve para cambios grandes o cuando el cliente quiere aprobar.

## Validación automática (GitHub Actions)
`.github/workflows/validate.yml` corre en cada push a `main` y en cada Pull Request:
`npm run validate` (esquemas Zod, enlaces, imágenes) → `typecheck` → `test` → `build`.
Si el contenido es inválido, la acción falla y el PR muestra una X roja con el motivo.

## Vistas previas por rama / PR (Cloudflare)
1. Cloudflare → tu Worker → **Settings → Build → Branch control**: activa las compilaciones de ramas no productivas (**Enable preview builds**).
2. Comando de despliegue de ramas: `npx wrangler preview` (el de producción sigue siendo `npx wrangler deploy`). Requiere Wrangler 4.21.0 o superior y subdominio workers.dev activo.
3. En cada PR, Cloudflare comenta con la URL del commit y la de la rama.
4. Las vistas previas usan los mismos recursos que producción: no pongas secretos ni datos reales en ellas.

## Flujo con revisión desde Pages CMS
En Pages CMS el repositorio puede abrirse en una rama distinta de `main`. Edita ahí, abre el PR en GitHub, revisa la vista previa y fusiona.

## Proteger `main` (manual, en GitHub)
Settings → Branches → Add rule para `main`:
- Require a pull request before merging
- Require status checks to pass → selecciona **validar**
Si activas esto, la publicación directa desde Pages CMS en `main` deja de funcionar: elige un modo por cliente.

## Revertir
Cada cambio es un commit. En GitHub: abre el commit o PR → **Revert**. Cloudflare vuelve a publicar.

## Qué no está verificado aún
Las ejecuciones de Actions y las vistas previas de Cloudflare dependen de tu cuenta; confírmalas con un primer PR de prueba.
