import { Link } from 'react-router-dom';
import { content } from '@/content/loader';
import { SocialIcons } from '@/components/ui/SocialIcons';

export function Footer() {
  const { site, navigation } = content;
  const f = site.footer;
  const { email, phone, address } = site.contact;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 text-sm sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <p className="font-mono text-lg font-semibold">{site.name}</p>
          <p className="mt-3 max-w-xs text-muted">{f.tagline}</p>
          {f.blurb && <p className="mt-3 max-w-xs text-muted">{f.blurb}</p>}
        </div>

        <nav aria-label={f.navTitle}>
          <p className="font-mono text-xs text-primary">{f.navTitle}</p>
          <ul className="mt-3 space-y-2 text-muted">
            {navigation.items.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p className="font-mono text-xs text-primary">{f.contactTitle}</p>
          <div className="mt-3">
            <SocialIcons />
          </div>
          <ul className="mt-4 space-y-2 text-muted">
            <li>
              <a href={`mailto:${email}`} className="break-all hover:text-ink">
                {email}
              </a>
            </li>
            {phone && <li>{phone}</li>}
            {address && <li>{address}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-5 text-xs text-muted sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. {f.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
