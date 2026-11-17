import type { Section } from '@/types/content';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'text' }>;

export function TextBlock({ eyebrow, title, paragraphs, image }: Props) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} className="border-t border-line">
      <div className={image ? 'grid items-center gap-10 md:grid-cols-[1fr_16rem]' : 'max-w-3xl'}>
        <div className="space-y-4 text-lg text-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {image && <img src={image} alt="" className="w-full max-w-xs rounded-theme border border-line bg-surface object-cover" />}
      </div>
    </SectionShell>
  );
}
