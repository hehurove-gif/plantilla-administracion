import type { Service } from '@/types/content';

const paths: Record<Service['icon'], string> = {
  code: 'M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12',
  palette: 'M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2H17a4 4 0 004-4c0-5-4-10-9-10z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z',
  rocket: 'M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M14 4c3 0 6 3 6 6-2 4-5 7-9 8l-5-5c1-4 4-7 8-9z',
  chat: 'M4 5h16v11H9l-5 4V5z',
};

export function Icon({ name }: { name: Service['icon'] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
