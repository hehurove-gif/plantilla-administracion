import type { Section } from '@/types/content';
import { Hero } from './Hero';
import { Services } from './Services';
import { Testimonials } from './Testimonials';
import { TextBlock } from './TextBlock';
import { Cta } from './Cta';
import { Contact } from './Contact';

/** Renderiza una sección según su `type`. Añadir un tipo nuevo obliga (por TypeScript) a manejarlo aquí. */
export function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return <Hero {...section} />;
    case 'services':
      return <Services {...section} />;
    case 'testimonials':
      return <Testimonials {...section} />;
    case 'text':
      return <TextBlock {...section} />;
    case 'cta':
      return <Cta {...section} />;
    case 'contact':
      return <Contact {...section} />;
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}
