import { content } from '@/content/loader';
import { whatsappLink } from '@/utils/whatsapp';
import { Button } from './Button';

/** Botón de WhatsApp. No muestra nada si site.json no tiene número configurado. */
export function WhatsappButton({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) {
  const { whatsapp, whatsappMessage, whatsappLabel } = content.site.contact;
  const href = whatsappLink(whatsapp, whatsappMessage);
  if (!href) return null;
  return (
    <Button href={href} variant={variant}>
      {whatsappLabel}
    </Button>
  );
}
