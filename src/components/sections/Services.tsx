import type { Section } from '@/types/content';
import { content } from '@/content/loader';
import { Icon } from '@/components/ui/Icon';

type Props = Extract<Section, { type: 'services' }>;

export function Services({ title, intro, limit }: Props) {
  const items = limit ? content.services.slice(0, limit) : content.services;
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-3xl font-bold">{title}</h2>
      {intro && <p className="mt-2 max-w-2xl text-muted">{intro}</p>}
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <li key={s.id} className="rounded-theme border border-muted/20 bg-surface p-6 shadow-sm">
            <span className="inline-flex rounded-theme bg-primary/10 p-2 text-primary">
              <Icon name={s.icon} />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.description}</p>
            {s.price && <p className="mt-3 text-sm font-medium text-primary">{s.price}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
