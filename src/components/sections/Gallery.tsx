import type { Section } from '@/types/content';
import { SectionShell } from '@/components/ui/SectionShell';

type Props = Extract<Section, { type: 'gallery' }>;

export function Gallery({ eyebrow, title, intro, images }: Props) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} intro={intro} className="border-t border-line">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((g, i) => (
          <li key={i}>
            <figure>
              <img src={g.image} alt={g.alt} loading="lazy" className="aspect-[4/3] w-full rounded-theme border border-line bg-surface object-cover" />
              {g.caption && <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
