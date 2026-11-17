import { z } from 'zod';

/** Ruta local (/images/x.png) o URL https. */
export const imagePath = z
  .string()
  .regex(/^(\/[^\s]+|https:\/\/[^\s]+)$/, 'Debe ser una ruta que empiece con "/" o una URL https');

/** Enlace interno, externo, ancla, mailto o tel. */
export const href = z
  .string()
  .regex(/^(\/[^\s]*|#[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/, 'Enlace no válido');

const hexColor = z.string().regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, 'Debe ser un color hexadecimal, ej. #4f46e5');

export const link = z.object({
  label: z.string().min(1),
  href,
});

export const iconNames = ['code', 'palette', 'chart', 'shield', 'rocket', 'chat'] as const;

/* ---------- site / navigation / theme ---------- */

export const siteSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().min(1),
  contact: z.object({
    email: z.email(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  social: z.array(link).default([]),
  footerText: z.string().min(1),
});

export const navigationSchema = z.object({
  items: z.array(link).min(1),
});

export const themeSchema = z.object({
  colors: z.object({
    primary: hexColor,
    primaryContrast: hexColor,
    background: hexColor,
    surface: hexColor,
    text: hexColor,
    muted: hexColor,
  }),
  radius: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('lg'),
});

/* ---------- colecciones ---------- */

export const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.enum(iconNames).default('code'),
  price: z.string().optional(),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  role: z.string().optional(),
  quote: z.string().min(1),
  image: imagePath.optional(),
});

export const servicesCollectionSchema = z.object({
  items: z.array(serviceSchema),
});

export const testimonialsCollectionSchema = z.object({
  items: z.array(testimonialSchema),
});

/* ---------- secciones de página ---------- */

export const heroSection = z.object({
  type: z.literal('hero'),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  image: imagePath.optional(),
  primaryCta: link.optional(),
  secondaryCta: link.optional(),
});

export const servicesSection = z.object({
  type: z.literal('services'),
  title: z.string().min(1),
  intro: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

export const testimonialsSection = z.object({
  type: z.literal('testimonials'),
  title: z.string().min(1),
  limit: z.number().int().positive().optional(),
});

export const textSection = z.object({
  type: z.literal('text'),
  title: z.string().optional(),
  paragraphs: z.array(z.string().min(1)).min(1),
});

export const ctaSection = z.object({
  type: z.literal('cta'),
  title: z.string().min(1),
  text: z.string().optional(),
  button: link,
});

export const contactSection = z.object({
  type: z.literal('contact'),
  title: z.string().min(1),
  intro: z.string().optional(),
});

export const sectionSchema = z.discriminatedUnion('type', [
  heroSection,
  servicesSection,
  testimonialsSection,
  textSection,
  ctaSection,
  contactSection,
]);

export const pageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'El slug debe usar minúsculas, números y guiones'),
  title: z.string().min(1),
  description: z.string().optional(),
  sections: z.array(sectionSchema).min(1),
});
