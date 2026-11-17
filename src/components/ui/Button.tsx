import type { ReactNode } from 'react';
import { SmartLink } from '@/utils/links';

interface Props {
  href: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center rounded-theme px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

const variants = {
  primary: 'bg-primary text-primary-contrast hover:opacity-90',
  secondary: 'border border-muted/40 text-ink hover:bg-ink/5',
};

export function Button({ href, variant = 'primary', children }: Props) {
  return (
    <SmartLink to={href} className={`${base} ${variants[variant]}`}>
      {children}
    </SmartLink>
  );
}
