import type { Section } from '@/types/content';
import { SectionShell } from '@/components/ui/SectionShell';
import { SmartLink } from '@/utils/links';

type Props = Extract<Section, { type: 'pricing' }>;

const check = (
  <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export function Pricing({ eyebrow, title, intro, plans }: Props) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} intro={intro} className="border-t border-line">
      <ul className="grid items-start gap-6 md:grid-cols-3">
        {plans.map((plan, i) => {
          const hi = plan.highlighted;
          return (
            <li
              key={i}
              className={`flex h-full flex-col rounded-theme border p-8 ${
                hi ? 'border-primary bg-primary text-on-primary shadow-xl md:scale-105' : 'border-line bg-surface'
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.description && <p className={`mt-1 text-sm ${hi ? 'opacity-80' : 'text-muted'}`}>{plan.description}</p>}
              <p className="mt-6 break-words">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className={`ml-1 text-sm ${hi ? 'opacity-80' : 'text-muted'}`}>{plan.period}</span>}
              </p>
              {plan.features.length > 0 && (
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className={hi ? '' : 'text-primary'}>{check}</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {plan.cta && (
                <SmartLink
                  to={plan.cta.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                    hi ? 'bg-surface text-ink hover:opacity-90' : 'bg-primary text-on-primary hover:brightness-110'
                  }`}
                >
                  {plan.cta.label}
                </SmartLink>
              )}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
