import { resolveHref, type Locale } from '@/i18n/config';
import type { BlockHeading } from '@/lib/strapi/types';

// A CMS block heading as the collection blueprint takes it, under the id that names the block's region.
export const collectionHeading = ({ label, title, text }: BlockHeading, id: string) => ({ id, label, title, text });

// The heading's first link, as listings show it beside or below their tiles ("View all projects").
export const viewAllLink = (lang: Locale, { links }: BlockHeading) => (links[0] ? { label: links[0].label, href: resolveHref(lang, links[0].url) } : undefined);
