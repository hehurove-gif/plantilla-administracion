import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { content } from '@/content/loader';

export function Header() {
  const [open, setOpen] = useState(false);
  const { site, navigation } = content;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-theme px-3 py-2 text-sm font-medium transition hover:bg-ink/5 ${isActive ? 'text-primary' : 'text-ink'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-muted/20 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-ink">
          {site.name}
        </Link>

        <nav className="hidden gap-1 md:flex" aria-label="Principal">
          {navigation.items.map((item) => (
            <NavLink key={item.href} to={item.href} end className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-theme p-2 md:hidden"
          aria-expanded={open}
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-muted/20 px-4 py-2 md:hidden" aria-label="Móvil">
          {navigation.items.map((item) => (
            <NavLink key={item.href} to={item.href} end className={linkClass} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
