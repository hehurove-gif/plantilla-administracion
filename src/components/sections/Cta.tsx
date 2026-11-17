import type { Section } from '@/types/content';
import { SmartLink } from '@/utils/links';

type Props = Extract<Section, { type: 'cta' }>;

export function Cta({ title, text, button }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-theme bg-primary px-6 py-12 text-center text-primary-contrast">
        <h2 className="text-3xl font-bold">{title}</h2>
        {text && <p className="mx-auto mt-3 max-w-xl opacity-90">{text}</p>}
        <SmartLink
          to={button.href}
          className="mt-6 inline-flex rounded-theme bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:opacity-90"
        >
          {button.label}
        </SmartLink>
      </div>
    </section>
  );
}
