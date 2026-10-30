import type { Locale } from '@/i18n/config';
import { uniqueBySlug } from '@/lib/data/unique-by-slug';
import { strapiGet } from '@/lib/strapi/client';
import type { Collection, Media, PageHero, Seo, Single, Taxonomy } from '@/lib/strapi/types';

// A resource is a downloadable file or, without one, a link to a resource hosted elsewhere.
export type ResourceCard = {
	documentId: string;
	title: string;
	publishDate: string | null;
	externalUrl: string | null;
	coverImage: Media | null;
	file: { url: string; ext: string; size: number } | null;
};

export type LibraryPage = {
	title: string;
	hero: PageHero | null;
	seo: Seo | null;
};

export type ResourceFilters = { type?: string };

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
// Newest first; the title breaks ties so pages never overlap.
const SORT = ['publishDate:desc', 'title:asc'];

export async function getLibraryPage(lang: Locale) {
	const { data } = await strapiGet<Single<LibraryPage>>('/library-page', { locale: lang, populate: { hero: true, seo: true } }, ['library-page']);

	return data;
}

export async function getResources(lang: Locale, filters: ResourceFilters, limit: number) {
	return strapiGet<Collection<ResourceCard>>(
		'/resources',
		{
			locale: lang,
			fields: ['title', 'publishDate', 'externalUrl'],
			filters: { resourceType: filters.type ? { slug: { $eq: filters.type } } : undefined },
			populate: { coverImage: { fields: MEDIA_FIELDS }, file: { fields: ['url', 'ext', 'size'] } },
			sort: SORT,
			pagination: { page: 1, pageSize: limit },
		},
		['resource'],
	);
}

// The type pills list only the types at least one resource uses, in the editors' order.
export async function getResourceTypes(lang: Locale) {
	const { data } = await strapiGet<Collection<{ resourceType: (Taxonomy & { order: number | null }) | null }>>(
		'/resources',
		{ locale: lang, fields: ['title'], populate: { resourceType: { fields: ['name', 'slug', 'order'] } }, pagination: { page: 1, pageSize: 100 } },
		['resource'],
	);

	return uniqueBySlug(data.map((resource) => resource.resourceType)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
