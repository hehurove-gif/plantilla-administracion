import { content } from '@/content/loader';
import { Button } from './Button';

/** Botón para agendar una llamada (Calendly, Google Calendar...). No muestra nada si site.json no tiene URL. */
export function ScheduleButton({ variant = 'secondary' }: { variant?: 'primary' | 'secondary' }) {
  const { schedulingUrl, schedulingLabel } = content.site.contact;
  if (!schedulingUrl) return null;
  return (
    <Button href={schedulingUrl} variant={variant}>
      {schedulingLabel}
    </Button>
  );
}
