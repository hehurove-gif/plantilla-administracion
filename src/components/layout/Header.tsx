import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { content } from '@/content/loader';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { WhatsappButton } from '@/components/ui/WhatsappButton';

export function Header() {
  const [open, setOpen] = useState(false);
  const { site, navigation } = content;

  const base = 'whitespace-nowrap text-sm transition-colors hover:text-ink';
  const linkClass = ({ isActive }: { isActive: boolean }) => `${base} ${isActive ? 'text-primary' : 'text-muted'}`;

  /** Los enlaces con ancla (/#servicios) usan <Link>; las páginas normales marcan la ruta activa. */
  const renderItem = (item: { label: string; href: string }, onClick?: () => void) =>
    item.href.includes('#') ? (
      <Link key={item.label} to={item.href} onClick={onClick} className={`${base} text-muted`}>
        {item.label}
      </Link>
    ) : (
      <NavLink key={item.label} to={item.href} end className={linkClass} onClick={onClick}>
        {item.label}
      </NavLink>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="shrink-0 font-mono text-lg font-semibold">
          <span className="text-primary">&lt;</span>
          {site.name}
          <span className="text-secondary"> /&gt;</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {navigation.items.map((item) => renderItem(item))}
        </nav>

        <div className="flex items-center gap-3">
          {content.theme.mode === 'auto' && <ThemeToggle />}
          <div className="hidden sm:block">
            <WhatsappButton />
          </div>
          <button
            type="button"
            className="rounded-md border border-line p-2 lg:hidden"
            aria-expanded={open}
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-bg lg:hidden" aria-label="Móvil">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3 sm:px-8 [&_a]:block [&_a]:py-2.5">
            {navigation.items.map((item) => (
              <li key={item.label}>{renderItem(item, () => setOpen(false))}</li>
            ))}
            <li className="pt-2 sm:hidden">
              <WhatsappButton />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
