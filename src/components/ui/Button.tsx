import type { ReactNode } from 'react';
import { SmartLink } from '@/utils/links';

interface Props {
  href: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors';

const variants = {
  primary: 'bg-primary text-on-primary hover:brightness-110',
  secondary: 'border border-line text-ink hover:border-secondary hover:text-secondary',
};

export function Button({ href, variant = 'primary', children }: Props) {
  return (
    <SmartLink to={href} className={`${base} ${variants[variant]}`}>
      {children}
    </SmartLink>
  );
}
