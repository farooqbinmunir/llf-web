import Link from 'next/link';
import { resolveHref, type Locale } from '@/i18n/config';
import type { SearchPage } from '@/lib/data/search';

type SearchQuickLinksProps = { lang: Locale; links: SearchPage['quickLinks'] };

// The main sections of the site, offered on the Search page before a search and when one finds nothing.
export default function SearchQuickLinks({ lang, links }: SearchQuickLinksProps) {
	if (!links.length) return null;

	return (
		<ul className="rsg-search-quick-links">
			{links.map((link) => (
				<li key={link.id}>
					<Link href={resolveHref(lang, link.linkUrl)}>
						<span className="rsg-title rsg-fa">{link.title}</span>
						{link.text && <span className="rsg-description">{link.text}</span>}
					</Link>
				</li>
			))}
		</ul>
	);
}
