import type { Dictionary } from '@/i18n/dictionaries';

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
			{ key: 'governance', href: '/governance' },
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

// TODO - Replace the placeholder URLs with LLF's real accounts, ideally managed from the Strapi `global` single type.
export const socialLinks = [
	{ network: 'linkedin', label: 'LinkedIn', href: '#' },
	{ network: 'facebook', label: 'Facebook', href: '#' },
	{ network: 'x', label: 'X', href: '#' },
	{ network: 'instagram', label: 'Instagram', href: '#' },
	{ network: 'youtube', label: 'YouTube', href: '#' },
] as const;
