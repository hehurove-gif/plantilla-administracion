import type { Section } from '@/types/content';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'process' }>;

export function Process({ eyebrow, title, steps }: Props) {
  const n = steps.length;
  // Franja superior con degradado continuo entre tarjetas (primario → secundario).
  const mix = (t: number) => `color-mix(in oklab, var(--c-secondary) ${Math.round(t * 100)}%, var(--c-primary))`;
  return (
    <SectionShell eyebrow={eyebrow} title={title} className="border-t border-line">
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={i} className="relative overflow-hidden rounded-theme border border-line bg-surface p-6 pt-7">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: `linear-gradient(90deg, ${mix(i / n)}, ${mix((i + 1) / n)})` }}
            />
            <span className="font-mono text-sm text-secondary">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
