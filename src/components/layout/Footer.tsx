import { content } from '@/content/loader';
import { SmartLink } from '@/utils/links';

export function Footer() {
  const { site } = content;
  return (
    <footer className="border-t border-muted/20 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{site.footerText}</p>
        {site.social.length > 0 && (
          <ul className="flex gap-4">
            {site.social.map((s) => (
              <li key={s.href}>
                <SmartLink to={s.href} className="hover:text-primary">
                  {s.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
