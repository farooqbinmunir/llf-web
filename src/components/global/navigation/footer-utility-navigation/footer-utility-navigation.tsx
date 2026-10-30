import Link from 'next/link';
import { legalNavigation } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type FooterUtilityNavigationProps = { lang: Locale; label: string; nav: Dictionary['nav'] };

export default function FooterUtilityNavigation({ lang, label, nav }: FooterUtilityNavigationProps) {
	return (
		<nav className="rsg-footer-utility-navigation" aria-label={label}>
			<ul role="list">
				{legalNavigation.map(({ key, href }) => (
					<li key={key} className="rsg-nav-item">
						<Link className="rsg-nav-link" href={localisedPath(lang, href)}>
							{nav[key]}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
