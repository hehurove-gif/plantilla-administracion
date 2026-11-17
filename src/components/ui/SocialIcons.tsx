import { content } from '@/content/loader';
import { whatsappLink } from '@/utils/whatsapp';

const LABELS = { instagram: 'Instagram', x: 'X', linkedin: 'LinkedIn', github: 'GitHub', tiktok: 'TikTok', discord: 'Discord', whatsapp: 'WhatsApp' } as const;

/** Íconos de redes: WhatsApp (desde contact.whatsapp) más las redes de site.social. Si no hay ninguna, no renderiza nada. */
export function SocialIcons() {
  const { site } = content;
  const wa = whatsappLink(site.contact.whatsapp, site.contact.whatsappMessage);
  const items = [
    wa && { network: 'whatsapp' as const, url: wa },
    ...site.social,
  ].filter((x): x is { network: keyof typeof LABELS; url: string } => Boolean(x));

  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((s) => (
        <li key={s.network}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[s.network]}
            title={LABELS[s.network]}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface transition-colors hover:border-primary/60"
          >
            <img src={`/social/${s.network}.png`} alt="" width={24} height={24} className="h-6 w-6" />
          </a>
        </li>
      ))}
    </ul>
  );
}
