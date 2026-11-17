import type { Section } from '@/types/content';
import { content } from '@/content/loader';
import { SectionShell } from '@/components/ui/SectionShell';
import { SocialIcons } from '@/components/ui/SocialIcons';
import { ScheduleButton } from '@/components/ui/ScheduleButton';
import { WhatsappButton } from '@/components/ui/WhatsappButton';

type Props = Extract<Section, { type: 'contact' }>;

/** Muestra los datos de contacto de site.json (única fuente de verdad). */
export function Contact({ eyebrow, title, intro, showWhatsapp, showSchedule, showSocial }: Props) {
  const { contact } = content.site;
  return (
    <SectionShell eyebrow={eyebrow} title={title} intro={intro} className="border-t border-line">
      <div className="max-w-3xl">
        <dl className="space-y-4 rounded-theme border border-line bg-surface p-6">
          <div>
            <dt className="text-sm text-muted">Correo</dt>
            <dd>
              <a className="font-medium text-primary hover:underline" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </dd>
          </div>
          {contact.phone && (
            <div>
              <dt className="text-sm text-muted">Teléfono</dt>
              <dd>
                <a className="font-medium text-primary hover:underline" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                  {contact.phone}
                </a>
              </dd>
            </div>
          )}
          {contact.address && (
            <div>
              <dt className="text-sm text-muted">Ubicación</dt>
              <dd className="font-medium">{contact.address}</dd>
            </div>
          )}
        </dl>
        {(showWhatsapp || showSchedule || showSocial) && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {showWhatsapp && <WhatsappButton />}
            {showSchedule && <ScheduleButton />}
            {showSocial && <SocialIcons />}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
