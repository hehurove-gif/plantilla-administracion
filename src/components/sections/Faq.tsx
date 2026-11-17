import type { Section } from '@/types/content';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'faq' }>;

export function Faq({ eyebrow, title, items }: Props) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} className="border-t border-line">
      <div className="max-w-3xl divide-y divide-line rounded-theme border border-line bg-surface">
        {items.map((it, i) => (
          <details key={i} className="group px-5 py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
              {it.question}
              <span className="faq-icon font-mono text-xl text-primary transition-transform" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted">{it.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
