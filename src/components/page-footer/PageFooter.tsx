import Link from 'next/link';
import { cacheLife } from 'next/cache';
import Logo from '@/components/logo/Logo';
import { footerNavigation, legalNavigation, socialLinks } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import FooterColumn from './FooterColumn';

type PageFooterProps = { lang: Locale; dictionary: Dictionary };

export default async function PageFooter({ lang, dictionary }: PageFooterProps) {
	// Cached so the copyright year can be read during prerendering; a day-long life keeps it current across the new year.
	'use cache';
	cacheLife('days');

	const { a11y, footer, nav } = dictionary;

	return (
		<footer className="page-footer rsg-surface-dark">
			<div className="container-xxl">
				<div className="row-top">
					<div className="brand">
						<Logo lang={lang} label={a11y.home} />
						<p className="strapline">{footer.tagline}</p>
					</div>

					<nav className="footer-navigation" aria-label={a11y.footerNavigation}>
						{footerNavigation.map(({ heading, items }) => (
							<FooterColumn key={heading} heading={footer[heading]}>
								{items.map(({ key, href }) => (
									<li key={key}>
										<Link className="link" href={localisedPath(lang, href)}>
											{nav[key]}
										</Link>
									</li>
								))}
							</FooterColumn>
						))}

						<div className="contact">
							<h2 className="heading">{footer.getInTouch}</h2>
							<Link className="link contact-link" href={localisedPath(lang, '/contact')}>
								{nav.contact}
							</Link>

							<ul className="social-navigation" role="list">
								{socialLinks.map(({ network, label, href }) => (
									<li key={network}>
										<a className={`social-link ${network}`} href={href} aria-label={label} />
									</li>
								))}
							</ul>
						</div>
					</nav>
				</div>

				<div className="row-bottom">
					<p className="copyright">
						© {new Date().getFullYear()} {footer.rights}
					</p>

					<ul className="utility-navigation" role="list">
						{legalNavigation.map(({ key, href }) => (
							<li key={key}>
								<Link className="link" href={localisedPath(lang, href)}>
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
