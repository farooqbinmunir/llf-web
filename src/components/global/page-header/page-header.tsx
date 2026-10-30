import Link from 'next/link';
import PrimaryNavigation from '@/components/global/navigation/primary-navigation/primary-navigation';
import Logo from '@/components/global/svg/logo';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import LanguageSwitcher from './language-switcher';
import MobileMenu from './mobile-menu';
import SearchLink from './search-link';

type PageHeaderProps = { lang: Locale; dictionary: Dictionary };

export default function PageHeader({ lang, dictionary }: PageHeaderProps) {
	const { a11y, header, nav } = dictionary;

	return (
		// `rsg-js-page-header` lets the mobile menu find the header it lives in, to make the rest of the page inert while it is open.
		<header className="rsg-page-header rsg-surface-light-4 rsg-js-page-header">
			<div className="rsg-header-layout container-xxl">
				<Link className="rsg-brand-link" href={localisedPath(lang, '/')} aria-label={a11y.home}>
					<Logo />
				</Link>

				<div className="rsg-header-primary-navigation">
					<PrimaryNavigation lang={lang} label={a11y.mainNavigation} labels={nav} instance="desktop" />
				</div>

				<div className="rsg-header-tools">
					<SearchLink lang={lang} label={header.search} />
					<LanguageSwitcher lang={lang} label={a11y.changeLanguage} />
				</div>

				<MobileMenu lang={lang} dictionary={{ a11y, header, nav }} />
			</div>
		</header>
	);
}
