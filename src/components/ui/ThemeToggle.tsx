import { useEffect, useState } from 'react';
import { effectiveScheme, nextScheme, storeScheme, type Scheme } from '@/themes/themeMode';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Botón sol/luna. Solo se muestra cuando theme.json tiene mode "auto". */
export function ThemeToggle() {
  const [scheme, setScheme] = useState<Scheme>(() =>
    effectiveScheme(document.documentElement.getAttribute('data-theme'), window.matchMedia(LIGHT_QUERY).matches),
  );

  // Si nadie eligió manualmente, seguir los cambios del dispositivo.
  useEffect(() => {
    const mq = window.matchMedia(LIGHT_QUERY);
    const onChange = () => {
      if (!document.documentElement.getAttribute('data-theme')) setScheme(mq.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = nextScheme(scheme);
    document.documentElement.setAttribute('data-theme', next);
    storeScheme(getStorage(), next);
    setScheme(next);
  };

  const label = scheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="rounded-md border border-line p-2 text-ink transition-colors hover:border-primary hover:text-primary"
    >
      {scheme === 'dark' ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
