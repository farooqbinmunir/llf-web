'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher';
import SearchLink from '@/components/search-link/SearchLink';
import SiteNav from '@/components/site-header/SiteNav';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type MobileMenuProps = { lang: Locale; dictionary: Pick<Dictionary, 'a11y' | 'header' | 'nav'> };

export default function MobileMenu({ lang, dictionary }: MobileMenuProps) {
	const pathname = usePathname();
	const panelId = useId();
	const toggleRef = useRef<HTMLButtonElement>(null);
	// Remembering the path the menu was opened on closes it on any navigation, with no effect needed.
	const [openOnPath, setOpenOnPath] = useState<string | null>(null);
	const isOpen = openOnPath === pathname;

	useEffect(() => {
		if (!isOpen) return;

		const header = toggleRef.current?.closest('header');
		// Everything outside the header is made inert, so keyboard and screen reader users stay inside the open menu.
		const outside = [...(header?.parentElement?.children ?? [])].filter((element) => element !== header);
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;

			setOpenOnPath(null);
			toggleRef.current?.focus();
		};

		outside.forEach((element) => element.setAttribute('inert', ''));
		document.documentElement.classList.add('rsg-has-open-menu');
		document.addEventListener('keydown', closeOnEscape);

		return () => {
			outside.forEach((element) => element.removeAttribute('inert'));
			document.documentElement.classList.remove('rsg-has-open-menu');
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [isOpen]);

	return (
		<div className="rsg-mobile-menu" data-open={isOpen || undefined}>
			<button
				ref={toggleRef}
				className="rsg-mobile-menu__toggle"
				type="button"
				aria-expanded={isOpen}
				aria-controls={panelId}
				aria-label={isOpen ? dictionary.a11y.closeMenu : dictionary.a11y.openMenu}
				onClick={() => setOpenOnPath(isOpen ? null : pathname)}
			/>

			<div id={panelId} className="rsg-mobile-menu__panel" hidden={!isOpen}>
				<div className="rsg-mobile-menu__tools">
					<SearchLink lang={lang} label={dictionary.header.search} />
					<LanguageSwitcher lang={lang} label={dictionary.a11y.changeLanguage} />
				</div>

				<nav className="rsg-mobile-menu__nav surface-dark" aria-label={dictionary.a11y.mainNavigation}>
					<SiteNav lang={lang} labels={dictionary.nav} listClassName="rsg-mobile-menu__list" linkClassName="rsg-mobile-menu__link" />
				</nav>
			</div>
		</div>
	);
}
