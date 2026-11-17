import type { z } from 'zod';
import type {
  siteSchema,
  navigationSchema,
  themeSchema,
  serviceSchema,
  projectSchema,
  testimonialSchema,
  sectionSchema,
  pageSchema,
} from '@/schemas';

export type Site = z.infer<typeof siteSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Page = z.infer<typeof pageSchema>;

export interface ContentBundle {
  site: Site;
  navigation: Navigation;
  theme: Theme;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  pages: Page[];
}
