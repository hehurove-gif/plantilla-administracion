import type { Section } from '@/types/content';
import { Button } from '@/components/ui/Button';
import { WhatsappButton } from '@/components/ui/WhatsappButton';

type Props = Extract<Section, { type: 'hero' }>;

export function Hero({ eyebrow, title, titleHighlight, subtitle, image, primaryCta, secondaryCta, showWhatsapp, tagsLabel, tags }: Props) {
  return (
    <div className="hero-glow border-b border-line">
      <section className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="min-w-0 max-w-3xl">
            {eyebrow && <p className="font-mono text-sm text-primary">{eyebrow}</p>}
            <h1 className="mt-4 break-words text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{title}
              {titleHighlight && (
                <>
                  {' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{titleHighlight}</span>
                </>
              )}
            </h1>
            {subtitle && <p className="mt-6 max-w-2xl text-lg text-muted">{subtitle}</p>}

            {(showWhatsapp || primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {showWhatsapp && <WhatsappButton />}
                {primaryCta && <Button href={primaryCta.href}>{primaryCta.label}</Button>}
                {secondaryCta && (
                  <Button href={secondaryCta.href} variant="secondary">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {image && (
            <img
              src={image}
              alt=""
              className="order-first w-full max-w-xs rounded-theme border border-line bg-surface object-cover md:order-none md:max-w-sm"
            />
          )}
        </div>

        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2">
            {tagsLabel && <span className="mr-1 font-mono text-xs text-muted">{tagsLabel}</span>}
            {tags.map((t, i) => (
              <span key={i} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs">
                {t}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
