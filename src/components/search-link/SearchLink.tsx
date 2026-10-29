import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';

type SearchLinkProps = { lang: Locale; label: string };

export default function SearchLink({ lang, label }: SearchLinkProps) {
	return (
		<Link className="rsg-pill rsg-search-link" href={localisedPath(lang, '/search')}>
			{label}
		</Link>
	);
}
