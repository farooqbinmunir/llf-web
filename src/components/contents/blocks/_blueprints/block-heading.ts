import { resolveHref, type Locale } from '@/i18n/config';
import type { BlockHeading } from '@/lib/strapi/types';

// A CMS block heading as the collection blueprint takes it, under the id that names the block's region. The title is
// the page's heading when the block opens a page that has no hero.
export const collectionHeading = ({ label, title, text }: BlockHeading, id: string, isPageHeading = false) => ({
	id,
	label,
	title,
	text,
	titleTag: isPageHeading ? ('h1' as const) : ('h2' as const),
});

// The heading's first link, as listings show it beside or below their tiles ("View all projects").
export const viewAllLink = (lang: Locale, { links }: BlockHeading) => (links[0] ? { label: links[0].label, href: resolveHref(lang, links[0].url) } : undefined);
