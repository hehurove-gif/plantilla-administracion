/** Elección manual de tema (botón sol/luna). Funciones puras para poder probarlas sin navegador. */
export type Scheme = 'light' | 'dark';

/** Misma clave que usa el script en index.html (evita el parpadeo al cargar). */
export const THEME_STORAGE_KEY = 'theme';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function readStoredScheme(storage: StorageLike | null | undefined): Scheme | null {
  try {
    const v = storage?.getItem(THEME_STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export function storeScheme(storage: StorageLike | null | undefined, scheme: Scheme): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, scheme);
  } catch {
    /* modo privado o almacenamiento bloqueado: el botón funciona, solo no se recuerda */
  }
}

/** Tema que se está mostrando: el elegido (atributo data-theme) o, si no hay, el del dispositivo. */
export function effectiveScheme(attr: string | null | undefined, deviceIsLight: boolean): Scheme {
  if (attr === 'light' || attr === 'dark') return attr;
  return deviceIsLight ? 'light' : 'dark';
}

export const nextScheme = (s: Scheme): Scheme => (s === 'dark' ? 'light' : 'dark');
