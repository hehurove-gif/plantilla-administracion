import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { content } from '@/content/loader';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

/** Página genérica: se arma 100% a partir de content/pages/<slug>.json. */
export function ContentPage() {
  const { slug = 'home' } = useParams();
  const page = content.pages.find((p) => p.slug === slug);

  useEffect(() => {
    if (!page) return;
    document.title = page.slug === 'home' ? content.site.name : `${page.title} | ${content.site.name}`;
    const meta = document.querySelector('meta[name="description"]') ?? Object.assign(document.createElement('meta'), { name: 'description' });
    meta.setAttribute('content', page.description ?? content.site.description);
    if (!meta.parentElement) document.head.appendChild(meta);
  }, [page]);

  if (!page) return <Navigate to="/404" replace />;

  return (
    <>
      {page.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
    </>
  );
}
