import Link from 'next/link';
import { cacheLife } from 'next/cache';
import Logo from '@/components/logo/Logo';
import { footerNavigation, legalNavigation, socialLinks } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import FooterColumn from './FooterColumn';

type SiteFooterProps = { lang: Locale; dictionary: Dictionary };

export default async function SiteFooter({ lang, dictionary }: SiteFooterProps) {
	// Cached so the copyright year can be read during prerendering; a day-long life keeps it current across the new year.
	'use cache';
	cacheLife('days');

	const { a11y, footer, nav } = dictionary;

	return (
		<footer className="rsg-site-footer surface-dark">
			<div className="rsg-container">
				<div className="rsg-site-footer__main">
					<div className="rsg-site-footer__brand">
						<Logo lang={lang} label={a11y.home} />
						<p className="rsg-site-footer__tagline">{footer.tagline}</p>
					</div>

					<nav className="rsg-site-footer__nav" aria-label={a11y.footerNavigation}>
						{footerNavigation.map(({ heading, items }) => (
							<FooterColumn key={heading} heading={footer[heading]}>
								{items.map(({ key, href }) => (
									<li key={key}>
										<Link className="rsg-site-footer__link" href={localisedPath(lang, href)}>
											{nav[key]}
										</Link>
									</li>
								))}
							</FooterColumn>
						))}

						<div className="rsg-site-footer__contact">
							<h2 className="rsg-site-footer__heading rsg-site-footer__heading--contact">{footer.getInTouch}</h2>
							<Link className="rsg-site-footer__link rsg-site-footer__contact-link" href={localisedPath(lang, '/contact')}>
								{nav.contact}
							</Link>

							<ul className="rsg-site-footer__social" role="list">
								{socialLinks.map(({ network, label, href }) => (
									<li key={network}>
										<a className={`rsg-site-footer__social-link rsg-site-footer__social-link--${network}`} href={href} aria-label={label} />
									</li>
								))}
							</ul>
						</div>
					</nav>
				</div>

				<div className="rsg-site-footer__bottom">
					<p className="rsg-site-footer__copyright">
						© {new Date().getFullYear()} {footer.rights}
					</p>

					<ul className="rsg-site-footer__legal" role="list">
						{legalNavigation.map(({ key, href }) => (
							<li key={key}>
								<Link className="rsg-site-footer__link" href={localisedPath(lang, href)}>
									{nav[key]}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}
