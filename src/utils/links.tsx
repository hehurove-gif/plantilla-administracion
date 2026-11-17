import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  to: string;
  className?: string;
  children: ReactNode;
}

/** Enlace inteligente: interno con el router, externo con <a>. */
export function SmartLink({ to, className, children }: Props) {
  if (to.startsWith('/')) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(to);
  return (
    <a href={to} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}
