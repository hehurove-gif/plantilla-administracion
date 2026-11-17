import type { Section } from '@/types/content';
import { content } from '@/content/loader';

type Props = Extract<Section, { type: 'contact' }>;

/** Muestra los datos de contacto de site.json (única fuente de verdad). */
export function Contact({ title, intro }: Props) {
  const { contact } = content.site;
  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h2 className="text-3xl font-bold">{title}</h2>
      {intro && <p className="mt-2 text-muted">{intro}</p>}
      <dl className="mt-8 space-y-4 rounded-theme border border-muted/20 bg-surface p-6">
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
    </section>
  );
}
