import type { Locale } from '@/i18n/config';
import { TRANSLATIONS_QUERY } from '@/lib/data/global';
import { strapiGet } from '@/lib/strapi/client';
import type { Collection, Translation } from '@/lib/strapi/types';

// The entries with a page of their own, for sitemap.xml. The Sitemap page's own copy is in `pages.ts`.

export type IndexedEntry = { base: string; slug: string; updatedAt: string; localizations: Translation[] };

// Each collection with the section its pages sit under. Generic pages sit at the top level, and only top-level person
// groups (the governance bodies) have pages.
const COLLECTIONS = [
	{ path: '/projects', base: '/our-projects', tag: 'project' },
	{ path: '/stories', base: '/field-updates', tag: 'story' },
	{ path: '/news', base: '/news', tag: 'news-item' },
	{ path: '/person-groups', base: '/governance', tag: 'person-group', filters: { parent: { id: { $null: true } } } },
	{ path: '/pages', base: '', tag: 'page' },
];

export async function getIndexedEntries(lang: Locale) {
	const results = await Promise.all(
		COLLECTIONS.map(async ({ path, base, tag, filters }) => {
			const { data } = await strapiGet<Collection<Omit<IndexedEntry, 'base'>>>(
				path,
				{ locale: lang, fields: ['slug', 'updatedAt'], filters, populate: { localizations: TRANSLATIONS_QUERY }, pagination: { page: 1, pageSize: 100 } },
				[tag],
			);

			return data.map((entry) => ({ base, ...entry }));
		}),
	);

	return results.flat();
}
