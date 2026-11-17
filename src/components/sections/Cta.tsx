import type { Section } from '@/types/content';
import { Button } from '@/components/ui/Button';
import { WhatsappButton } from '@/components/ui/WhatsappButton';

type Props = Extract<Section, { type: 'cta' }>;

export function Cta({ eyebrow, title, text, button, showWhatsapp }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl border-t border-line px-5 py-20 sm:px-8">
      <div className="hero-glow rounded-theme border border-line bg-surface px-6 py-12 text-center">
        {eyebrow && <p className="font-mono text-sm text-primary">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
        {text && <p className="mx-auto mt-3 max-w-xl text-muted">{text}</p>}
        {(showWhatsapp || button) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {showWhatsapp && <WhatsappButton />}
            {button && (
              <Button href={button.href} variant={showWhatsapp ? 'secondary' : 'primary'}>
                {button.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
