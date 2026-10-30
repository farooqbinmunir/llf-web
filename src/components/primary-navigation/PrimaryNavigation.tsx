'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavigation } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type PrimaryNavigationProps = { lang: Locale; label: string; labels: Dictionary['nav']; variant: 'desktop' | 'mobile' };

// Shared by the desktop header and the mobile menu; the variant class styles the same links for each.
export default function PrimaryNavigation({ lang, label, labels, variant }: PrimaryNavigationProps) {
	const pathname = usePathname();

	return (
		<nav className={`primary-navigation ${variant}`} aria-label={label}>
			<ul className="list" role="list">
				{mainNavigation.map(({ key, href }) => {
					const path = localisedPath(lang, href);
					const isCurrent = pathname === path || pathname.startsWith(`${path}/`);

					return (
						<li key={key}>
							<Link className="link" href={path} aria-current={isCurrent ? 'page' : undefined}>
								{labels[key]}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
