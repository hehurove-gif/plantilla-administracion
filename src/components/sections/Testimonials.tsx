import type { Section } from '@/types/content';
import { content } from '@/content/loader';

type Props = Extract<Section, { type: 'testimonials' }>;

export function Testimonials({ title, limit }: Props) {
  const items = limit ? content.testimonials.slice(0, limit) : content.testimonials;
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">{title}</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <li key={t.id}>
              <figure className="h-full rounded-theme border border-muted/20 p-6">
                <blockquote className="text-ink">“{t.quote}”</blockquote>
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
      </div>
    </section>
  );
}
