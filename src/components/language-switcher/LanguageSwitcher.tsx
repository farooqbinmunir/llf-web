'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localeDetails, locales, type Locale } from '@/i18n/config';

type LanguageSwitcherProps = { lang: Locale; label: string };

// Swaps only the locale segment, so switching language keeps the visitor on the same page.
const switchLocale = (pathname: string, locale: Locale) => pathname.replace(/^\/[^/]+/, `/${locale}`);

export default function LanguageSwitcher({ lang, label }: LanguageSwitcherProps) {
	const pathname = usePathname();
	const optionsId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const closeOnOutsideClick = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
		};
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;

			setIsOpen(false);
			buttonRef.current?.focus();
		};

		document.addEventListener('pointerdown', closeOnOutsideClick);
		document.addEventListener('keydown', closeOnEscape);

		return () => {
			document.removeEventListener('pointerdown', closeOnOutsideClick);
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [isOpen]);

	return (
		<div className="rsg-language-switcher" ref={rootRef} data-open={isOpen || undefined}>
			<button ref={buttonRef} className="rsg-pill rsg-language-switcher__button" type="button" aria-expanded={isOpen} aria-controls={optionsId} aria-label={`${label}: ${localeDetails[lang].label}`} onClick={() => setIsOpen(!isOpen)}>
				{localeDetails[lang].label}
			</button>

			<ul id={optionsId} className="rsg-language-switcher__options" role="list" hidden={!isOpen}>
				{locales
					.filter((locale) => locale !== lang)
					.map((locale) => (
						<li key={locale}>
							<Link className="rsg-language-switcher__option" href={switchLocale(pathname, locale)} hrefLang={locale} lang={locale} onClick={() => setIsOpen(false)}>
								{localeDetails[locale].label}
							</Link>
						</li>
					))}
			</ul>
		</div>
	);
}
