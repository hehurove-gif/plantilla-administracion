import { z } from 'zod';

/** Ruta local (/images/x.png) o URL https. */
export const imagePath = z
  .string()
  .regex(/^(\/[^\s]+|https:\/\/[^\s]+)$/, 'Debe ser una ruta que empiece con "/" o una URL https');

/** Enlace interno (/ruta o /ruta#ancla), externo, ancla, mailto o tel. */
export const href = z
  .string()
  .regex(/^(\/[^\s]*|#[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/, 'Enlace no válido');

const hexColor = z.string().regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, 'Debe ser un color hexadecimal, ej. #22d3ee');

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Debe usar minúsculas, números y guiones');

export const link = z.object({
  label: z.string().min(1),
  href,
});

export const iconNames = ['code', 'palette', 'chart', 'shield', 'rocket', 'chat', 'bolt', 'mobile', 'settings'] as const;

/** Redes con ícono en public/social/<red>.png. WhatsApp se genera aparte desde contact.whatsapp. */
export const socialNetworks = ['instagram', 'x', 'linkedin', 'tiktok', 'discord'] as const;

/* ---------- site / navigation / theme ---------- */

export const siteSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  contact: z.object({
    email: z.email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    /** Solo dígitos con código de país (México: 52 + 10 dígitos). Vacío = no se muestran botones de WhatsApp. */
    whatsapp: z
      .string()
      .regex(/^(\d{8,15})?$/, 'Solo dígitos con código de país, ej. 5255XXXXXXXX (o vacío)')
      .default(''),
    whatsappMessage: z.string().default(''),
    whatsappLabel: z.string().default('WhatsApp'),
    /** Enlace para agendar una llamada (Calendly, Google Calendar...). Vacío = no se muestra el botón. */
    schedulingUrl: z
      .string()
      .regex(/^(https:\/\/[^\s]+)?$/, 'Debe ser una URL https (o vacío)')
      .default(''),
    schedulingLabel: z.string().default('Agendar una llamada'),
  }),
  /** Redes en el pie y en contacto. Quita una de la lista para ocultarla. */
  social: z
    .array(z.object({ network: z.enum(socialNetworks), url: z.string().regex(/^https:\/\/[^\s]+$/, 'Debe ser una URL https') }))
    .default([]),
  footer: z.object({
    tagline: z.string().min(1),
    blurb: z.string().optional(),
    navTitle: z.string().min(1),
    contactTitle: z.string().min(1),
    rights: z.string().min(1),
  }),
});

export const navigationSchema = z.object({
  items: z.array(link).min(1),
});

const paletteSchema = z.object({
  background: hexColor,
  backgroundSoft: hexColor,
  surface: hexColor,
  line: hexColor,
  text: hexColor,
  muted: hexColor,
  primary: hexColor,
  secondary: hexColor,
  onPrimary: hexColor,
});

export const themeSchema = z.object({
  /** auto = sigue el modo claro/oscuro del dispositivo. */
  mode: z.enum(['auto', 'dark', 'light']).default('auto'),
  dark: paletteSchema,
  light: paletteSchema,
  radius: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('xl'),
});

/* ---------- colecciones ---------- */

export const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.enum(iconNames).default('code'),
  price: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  tag: z.string().optional(),
  title: z.string().min(1),
  text: z.string().min(1),
  stack: z.array(z.string().min(1)).default([]),
  url: href.optional(),
  image: imagePath.optional(),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  role: z.string().optional(),
  quote: z.string().min(1),
  image: imagePath.optional(),
});

export const servicesCollectionSchema = z.object({ items: z.array(serviceSchema) });
export const projectsCollectionSchema = z.object({ items: z.array(projectSchema) });
export const testimonialsCollectionSchema = z.object({ items: z.array(testimonialSchema) });

/* ---------- secciones de página ---------- */

/** Campos comunes: `id` sirve como ancla (/#id) y `eyebrow` es la etiqueta pequeña sobre el título. */
const base = {
  id: slug.optional(),
  eyebrow: z.string().optional(),
};

export const heroSection = z.object({
  ...base,
  type: z.literal('hero'),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  image: imagePath.optional(),
  primaryCta: link.optional(),
  secondaryCta: link.optional(),
  /** Parte del título que se resalta con el degradado de acento. */
  titleHighlight: z.string().optional(),
  showWhatsapp: z.boolean().default(false),
  tagsLabel: z.string().optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export const servicesSection = z.object({
  ...base,
  type: z.literal('services'),
  title: z.string().min(1),
  intro: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

export const projectsSection = z.object({
  ...base,
  type: z.literal('projects'),
  title: z.string().min(1),
  intro: z.string().optional(),
  limit: z.number().int().positive().optional(),
  visitLabel: z.string().default('Ver sitio'),
});

export const processSection = z.object({
  ...base,
  type: z.literal('process'),
  title: z.string().min(1),
  steps: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
});

export const testimonialsSection = z.object({
  ...base,
  type: z.literal('testimonials'),
  title: z.string().min(1),
  limit: z.number().int().positive().optional(),
});

export const textSection = z.object({
  ...base,
  type: z.literal('text'),
  title: z.string().optional(),
  paragraphs: z.array(z.string().min(1)).min(1),
  image: imagePath.optional(),
});

export const pricingSection = z.object({
  ...base,
  type: z.literal('pricing'),
  title: z.string().min(1),
  intro: z.string().optional(),
  plans: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string().min(1),
        period: z.string().optional(),
        features: z.array(z.string().min(1)).default([]),
        highlighted: z.boolean().default(false),
        cta: link.optional(),
      }),
    )
    .min(1),
});

export const faqSection = z.object({
  ...base,
  type: z.literal('faq'),
  title: z.string().min(1),
  items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
});

export const ctaSection = z.object({
  ...base,
  type: z.literal('cta'),
  title: z.string().min(1),
  text: z.string().optional(),
  button: link.optional(),
  showWhatsapp: z.boolean().default(false),
  showSchedule: z.boolean().default(false),
});

export const contactSection = z.object({
  ...base,
  type: z.literal('contact'),
  title: z.string().min(1),
  intro: z.string().optional(),
  showWhatsapp: z.boolean().default(true),
  showSchedule: z.boolean().default(true),
  showSocial: z.boolean().default(true),
});

export const sectionSchema = z.discriminatedUnion('type', [
  heroSection,
  servicesSection,
  projectsSection,
  processSection,
  pricingSection,
  testimonialsSection,
  textSection,
  faqSection,
  ctaSection,
  contactSection,
]);

export const pageSchema = z.object({
  slug,
  title: z.string().min(1),
  description: z.string().optional(),
  sections: z.array(sectionSchema).min(1),
});
