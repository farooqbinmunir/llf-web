import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';

type SearchLinkProps = { lang: Locale; label: string };

export default function SearchLink({ lang, label }: SearchLinkProps) {
	return (
		<Link className="rsg-header-pill rsg-header-search-link" href={localisedPath(lang, '/search')}>
			<span>{label}</span>
			<span className="rsg-fa" aria-hidden="true" />
		</Link>
	);
}
