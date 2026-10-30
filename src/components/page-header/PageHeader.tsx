import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher';
import Logo from '@/components/logo/Logo';
import MobileMenu from '@/components/mobile-menu/MobileMenu';
import PrimaryNavigation from '@/components/primary-navigation/PrimaryNavigation';
import SearchLink from '@/components/search-link/SearchLink';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type PageHeaderProps = { lang: Locale; dictionary: Dictionary };

export default function PageHeader({ lang, dictionary }: PageHeaderProps) {
	const { a11y, header, nav } = dictionary;

	return (
		// `rsg-js-page-header` lets the mobile menu find the header it lives in, to make the rest of the page inert while it is open.
		<header className="page-header rsg-surface-light-4 rsg-js-page-header">
			<div className="container-xxl layout">
				<Logo lang={lang} label={a11y.home} />

				<div className="navigation">
					<PrimaryNavigation lang={lang} label={a11y.mainNavigation} labels={nav} variant="desktop" />
				</div>

				<div className="tools">
					<SearchLink lang={lang} label={header.search} />
					<LanguageSwitcher lang={lang} label={a11y.changeLanguage} />
				</div>

				<MobileMenu lang={lang} dictionary={{ a11y, header, nav }} />
			</div>
		</header>
	);
}
