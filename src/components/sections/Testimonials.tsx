import type { Section } from '@/types/content';
import { content } from '@/content/loader';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'testimonials' }>;

export function Testimonials({ eyebrow, title, limit }: Props) {
  const items = limit ? content.testimonials.slice(0, limit) : content.testimonials;
  return (
    <SectionShell eyebrow={eyebrow} title={title} className="border-t border-line">
      <ul className="grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <li key={t.id}>
            <figure className="h-full rounded-theme border border-line bg-surface p-6">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 text-sm">
                {t.image && <img src={t.image} alt="" className="h-10 w-10 rounded-full object-cover" />}
                <span>
                  <strong>{t.author}</strong>
                  {t.role && <span className="block text-muted">{t.role}</span>}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
