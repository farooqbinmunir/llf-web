import Link from 'next/link';
import { cacheLife } from 'next/cache';
import FooterNavigation from '@/components/global/navigation/footer-navigation/footer-navigation';
import FooterUtilityNavigation from '@/components/global/navigation/footer-utility-navigation/footer-utility-navigation';
import Logo from '@/components/global/svg/logo';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type PageFooterProps = { lang: Locale; dictionary: Dictionary };

export default async function PageFooter({ lang, dictionary }: PageFooterProps) {
	// Cached so the copyright year can be read during prerendering; a day-long life keeps it current across the new year.
	'use cache';
	cacheLife('days');

	const { a11y, footer, nav } = dictionary;

	return (
		<footer className="rsg-page-footer rsg-surface-dark">
			<div className="container-xxl rsg-footer-layout">
				<div className="row rsg-row-top">
					<div className="col-12 col-lg-4 rsg-col-brand">
						<Link className="rsg-footer-logo-link" href={localisedPath(lang, '/')} aria-label={a11y.home}>
							<Logo />
						</Link>
						<p className="rsg-footer-strapline">{footer.tagline}</p>
					</div>

					<div className="col-12 col-lg-8 rsg-col-links">
						<FooterNavigation lang={lang} label={a11y.footerNavigation} socialLabel={a11y.socialNavigation} footer={footer} nav={nav} />
					</div>
				</div>

				<div className="rsg-row-bottom">
					<p className="rsg-footer-copyright">
						© {new Date().getFullYear()} {footer.rights}
					</p>

					<FooterUtilityNavigation lang={lang} label={a11y.legalNavigation} nav={nav} />
				</div>
			</div>
		</footer>
	);
}
