'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavigation } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type SiteNavProps = { lang: Locale; labels: Dictionary['nav']; listClassName: string; linkClassName: string };

// Shared by the desktop header and the mobile menu, which style the same links differently.
export default function SiteNav({ lang, labels, listClassName, linkClassName }: SiteNavProps) {
	const pathname = usePathname();

	return (
		<ul className={listClassName} role="list">
			{mainNavigation.map(({ key, href }) => {
				const path = localisedPath(lang, href);
				const isCurrent = pathname === path || pathname.startsWith(`${path}/`);

				return (
					<li key={key}>
						<Link className={linkClassName} href={path} aria-current={isCurrent ? 'page' : undefined}>
							{labels[key]}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
