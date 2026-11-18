import type { Section } from '@/types/content';
import { content } from '@/content/loader';
import { Icon } from '@/components/ui/Icon';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'services' }>;

export function Services({ eyebrow, title, intro, limit }: Props) {
  const items = limit ? content.services.slice(0, limit) : content.services;
  return (
    <SectionShell eyebrow={eyebrow} title={title} intro={intro}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <li key={s.id} className="overflow-hidden rounded-theme border border-line bg-surface transition-colors hover:border-primary/60">
            {s.image && <img src={s.image} alt="" loading="lazy" className="aspect-[2/1] w-full object-cover" />}
            <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-secondary">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-primary">
                <Icon name={s.icon} />
              </span>
            </div>
            <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-muted">{s.description}</p>
            {s.price && <p className="mt-3 text-sm font-medium text-primary">{s.price}</p>}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
