'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavigation } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type PrimaryNavigationProps = { lang: Locale; label: string; labels: Dictionary['nav']; instance: 'desktop' | 'mobile' };

// Shared by the desktop header and the mobile menu; the instance class styles the same links for each.
export default function PrimaryNavigation({ lang, label, labels, instance }: PrimaryNavigationProps) {
	const pathname = usePathname();

	return (
		<nav className={`rsg-primary-navigation is-${instance}`} aria-label={label}>
			<ul className="rsg-primary-navigation-list" role="list">
				{mainNavigation.map(({ key, href }) => {
					const path = localisedPath(lang, href);
					const isCurrent = pathname === path || pathname.startsWith(`${path}/`);

					return (
						<li key={key} className={isCurrent ? 'rsg-nav-item current' : 'rsg-nav-item'}>
							<Link className="rsg-nav-link" href={path} aria-current={isCurrent ? 'page' : undefined}>
								{labels[key]}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
