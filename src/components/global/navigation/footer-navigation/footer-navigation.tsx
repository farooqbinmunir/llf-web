import Link from 'next/link';
import SocialNavigation from '@/components/global/navigation/social-navigation/social-navigation';
import { footerNavigation } from '@/config/navigation';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import FooterColumn from './footer-column';

type FooterNavigationProps = { lang: Locale; label: string; socialLabel: string; footer: Dictionary['footer']; nav: Dictionary['nav'] };

// The link columns, then the fixed "Get in touch" column with the contact link and the social icons.
export default function FooterNavigation({ lang, label, socialLabel, footer, nav }: FooterNavigationProps) {
	return (
		<nav className="rsg-footer-navigation" aria-label={label}>
			{footerNavigation.map(({ heading, items }) => (
				<FooterColumn key={heading} heading={footer[heading]}>
					{items.map(({ key, href }) => (
						<li key={key} className="rsg-nav-item">
							<Link className="rsg-nav-link" href={localisedPath(lang, href)}>
								{nav[key]}
							</Link>
						</li>
					))}
				</FooterColumn>
			))}

			<div className="rsg-footer-column rsg-footer-contact">
				<h2 className="rsg-footer-column-title">{footer.getInTouch}</h2>
				<Link className="rsg-nav-link rsg-contact-link" href={localisedPath(lang, '/contact')}>
					{nav.contact}
				</Link>

				<SocialNavigation label={socialLabel} />
			</div>
		</nav>
	);
}
