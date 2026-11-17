import type { Section } from '@/types/content';
import { Button } from '@/components/ui/Button';

type Props = Extract<Section, { type: 'hero' }>;

export function Hero({ title, subtitle, image, primaryCta, secondaryCta }: Props) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta && <Button href={primaryCta.href}>{primaryCta.label}</Button>}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
      {image && <img src={image} alt="" className="w-full rounded-theme shadow-lg" />}
    </section>
  );
}
