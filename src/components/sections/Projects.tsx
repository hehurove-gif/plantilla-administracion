import type { Section } from '@/types/content';
import { content } from '@/content/loader';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'projects' }>;

export function Projects({ eyebrow, title, intro, limit, visitLabel }: Props) {
  const items = limit ? content.projects.slice(0, limit) : content.projects;
  return (
    <SectionShell eyebrow={eyebrow} title={title} intro={intro} className="border-t border-line">
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((p) => (
          <li key={p.id} className="flex flex-col overflow-hidden rounded-theme border border-line bg-surface">
            {p.cover && <img src={p.cover} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
            <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start gap-4">
              {p.image && <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded-xl border border-line object-contain" />}
              <div className="min-w-0">
                {p.tag && <p className="font-mono text-xs text-secondary">{p.tag}</p>}
                <h3 className="text-xl font-semibold">{p.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-muted">{p.text}</p>
            {p.stack.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((t, i) => (
                  <li key={i} className="rounded-md border border-line px-2 py-0.5 font-mono text-xs">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {p.url && (
              <a
                href={p.url}
                target={p.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit text-sm font-medium text-primary hover:underline"
              >
                {visitLabel} ↗
              </a>
            )}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
