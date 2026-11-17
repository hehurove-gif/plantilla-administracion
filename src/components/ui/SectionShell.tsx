import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title?: string;
  intro?: string;
  className?: string;
  children?: ReactNode;
}

/** Contenedor común de secciones: etiqueta pequeña, título e introducción opcionales. */
export function SectionShell({ eyebrow, title, intro, className = '', children }: Props) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 ${className}`}>
      {(eyebrow || title || intro) && (
        <header className="mb-10 max-w-2xl">
          {eyebrow && <p className="font-mono text-sm tracking-wide text-primary">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>}
          {intro && <p className="mt-4 text-muted">{intro}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
