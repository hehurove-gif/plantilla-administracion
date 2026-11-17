import type { Section } from '@/types/content';
import { Hero } from './Hero';
import { Services } from './Services';
import { Projects } from './Projects';
import { Process } from './Process';
import { Testimonials } from './Testimonials';
import { TextBlock } from './TextBlock';
import { Faq } from './Faq';
import { Cta } from './Cta';
import { Contact } from './Contact';

function renderSection(section: Section) {
  switch (section.type) {
    case 'hero':
      return <Hero {...section} />;
    case 'services':
      return <Services {...section} />;
    case 'projects':
      return <Projects {...section} />;
    case 'process':
      return <Process {...section} />;
    case 'testimonials':
      return <Testimonials {...section} />;
    case 'text':
      return <TextBlock {...section} />;
    case 'faq':
      return <Faq {...section} />;
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

/** Renderiza una sección según su `type`. Añadir un tipo nuevo obliga (por TypeScript) a manejarlo aquí. */
export function SectionRenderer({ section }: { section: Section }) {
  const node = renderSection(section);
  return section.id ? <div id={section.id}>{node}</div> : node;
}
