import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher';
import Logo from '@/components/logo/Logo';
import MobileMenu from '@/components/mobile-menu/MobileMenu';
import SearchLink from '@/components/search-link/SearchLink';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import SiteNav from './SiteNav';

type SiteHeaderProps = { lang: Locale; dictionary: Dictionary };

export default function SiteHeader({ lang, dictionary }: SiteHeaderProps) {
	const { a11y, header, nav } = dictionary;

	return (
		<header className="rsg-site-header surface-white">
			<div className="rsg-container rsg-site-header__inner">
				<Logo lang={lang} label={a11y.home} />

				<nav className="rsg-site-header__nav" aria-label={a11y.mainNavigation}>
					<SiteNav lang={lang} labels={nav} listClassName="rsg-site-nav" linkClassName="rsg-site-nav__link" />
				</nav>

				<div className="rsg-site-header__actions">
					<SearchLink lang={lang} label={header.search} />
					<LanguageSwitcher lang={lang} label={a11y.changeLanguage} />
				</div>

				<MobileMenu lang={lang} dictionary={{ a11y, header, nav }} />
			</div>
		</header>
	);
}
