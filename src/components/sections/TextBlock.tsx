import type { Section } from '@/types/content';

type Props = Extract<Section, { type: 'text' }>;

export function TextBlock({ title, paragraphs }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      {title && <h2 className="text-3xl font-bold">{title}</h2>}
      <div className="mt-4 space-y-4 text-lg text-muted">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
