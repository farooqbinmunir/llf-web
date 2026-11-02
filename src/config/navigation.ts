import type { Dictionary } from '@/i18n/dictionaries';
import type { SocialNetwork } from '@/lib/data/global';

type NavKey = keyof Dictionary['nav'];
type FooterKey = keyof Dictionary['footer'];

export type NavItem = { key: NavKey; href: string };

// Paths are locale-free; components prefix them with the current language via localisedPath().
export const mainNavigation: NavItem[] = [
	{ key: 'aboutUs', href: '/about-us' },
	{ key: 'ourProjects', href: '/our-projects' },
	{ key: 'fieldUpdates', href: '/field-updates' },
	{ key: 'library', href: '/library' },
	{ key: 'news', href: '/news' },
	{ key: 'contact', href: '/contact' },
];

export const footerNavigation: { heading: FooterKey; items: NavItem[] }[] = [
	{
		heading: 'ourWork',
		items: [
			{ key: 'aboutUs', href: '/about-us' },
			{ key: 'ourProjects', href: '/our-projects' },
			{ key: 'fromTheField', href: '/field-updates' },
			{ key: 'ourPartners', href: '/about-us#partners' },
			{ key: 'governance', href: '/about-us#governance' },
		],
	},
	{
		heading: 'getInvolved',
		items: [
			{ key: 'partnerships', href: '/partnerships' },
			{ key: 'fundingQueries', href: '/funding-queries' },
			{ key: 'careers', href: '/careers' },
		],
	},
	{
		heading: 'resources',
		items: [
			{ key: 'library', href: '/library' },
			{ key: 'newsMedia', href: '/news' },
			{ key: 'llfHub', href: '/llf-hub' },
		],
	},
];

export const legalNavigation: NavItem[] = [
	{ key: 'privacyPolicy', href: '/privacy-policy' },
	{ key: 'termsOfUse', href: '/terms-of-use' },
	{ key: 'accessibility', href: '/accessibility' },
	{ key: 'sitemap', href: '/sitemap' },
];

// The accounts themselves are set in Strapi's Global settings; each network's name labels its icon in every language.
export const socialNetworkNames: Record<SocialNetwork, string> = {
	linkedin: 'LinkedIn',
	facebook: 'Facebook',
	x: 'X',
	instagram: 'Instagram',
	youtube: 'YouTube',
};
