'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import PrimaryNavigation from '@/components/global/navigation/primary-navigation/primary-navigation';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import LanguageSwitcher from './language-switcher';
import SearchLink from './search-link';

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

		const header = toggleRef.current?.closest('.rsg-js-page-header');
		// Everything outside the header is made inert, so keyboard and screen reader users stay inside the open menu.
		const outside = [...(header?.parentElement?.children ?? [])].filter((element) => element !== header);
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;

			setOpenOnPath(null);
			toggleRef.current?.focus();
		};

		outside.forEach((element) => element.setAttribute('inert', ''));
		document.documentElement.classList.add('no-scroll');
		document.addEventListener('keydown', closeOnEscape);

		return () => {
			outside.forEach((element) => element.removeAttribute('inert'));
			document.documentElement.classList.remove('no-scroll');
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [isOpen]);

	return (
		<>
			<button
				ref={toggleRef}
				className="rsg-hamburger-button"
				type="button"
				aria-expanded={isOpen}
				aria-controls={panelId}
				aria-label={isOpen ? dictionary.a11y.closeMenu : dictionary.a11y.openMenu}
				onClick={() => setOpenOnPath(isOpen ? null : pathname)}
			>
				<span className="rsg-fa" aria-hidden="true" />
			</button>

			<div id={panelId} className="rsg-mobile-menu" hidden={!isOpen}>
				<div className="rsg-mobile-menu-tools">
					<SearchLink lang={lang} label={dictionary.header.search} />
					<LanguageSwitcher lang={lang} label={dictionary.a11y.changeLanguage} />
				</div>

				<div className="rsg-mobile-menu-navigation rsg-surface-dark">
					<PrimaryNavigation lang={lang} label={dictionary.a11y.mainNavigation} labels={dictionary.nav} instance="mobile" />
				</div>
			</div>
		</>
	);
}
