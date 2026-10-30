import type { Locale } from '@/i18n/config';
import { uniqueBySlug } from '@/lib/data/unique-by-slug';
import { strapiGet } from '@/lib/strapi/client';
import type { BodySection, Collection, Media, PageHero, Seo, Single, Taxonomy } from '@/lib/strapi/types';

export type NewsCard = {
	documentId: string;
	title: string;
	slug: string;
	publishDate: string | null;
	coverImage: Media | null;
};

export type NewsDetail = NewsCard & {
	excerpt: string | null;
	coverCaption: string | null;
	topic: Taxonomy | null;
	countries: Taxonomy[];
	focusAreas: Taxonomy[];
	body: BodySection[];
	seo: Seo | null;
};

export type NewsPage = {
	title: string;
	hero: PageHero | null;
	seo: Seo | null;
};

// The year is the year's number as text, as it appears in the URL.
export type NewsFilters = { country?: string; focusArea?: string; topic?: string; year?: string };

type FilterOption = Taxonomy & { order?: number | null };

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
const TAXONOMY_FIELDS = ['name', 'slug'];
const CARD_FIELDS = ['title', 'slug', 'publishDate'];
const CARD_POPULATE = { coverImage: { fields: MEDIA_FIELDS } };
// Newest first; the title breaks ties so pages never overlap.
const SORT = ['publishDate:desc', 'title:asc'];

export async function getNewsPage(lang: Locale) {
	const { data } = await strapiGet<Single<NewsPage>>('/news-page', { locale: lang, populate: { hero: true, seo: true } }, ['news-page']);

	return data;
}

export async function getNews(lang: Locale, filters: NewsFilters, limit: number) {
	return strapiGet<Collection<NewsCard>>(
		'/news',
		{
			locale: lang,
			fields: CARD_FIELDS,
			filters: {
				countries: filters.country ? { slug: { $eq: filters.country } } : undefined,
				focusAreas: filters.focusArea ? { slug: { $eq: filters.focusArea } } : undefined,
				topic: filters.topic ? { slug: { $eq: filters.topic } } : undefined,
				year: filters.year ? { year: { $eq: Number(filters.year) } } : undefined,
			},
			populate: CARD_POPULATE,
			sort: SORT,
			pagination: { page: 1, pageSize: limit },
		},
		['news-item'],
	);
}

// The newest news items, as the "Latest announcements" block lists them.
export async function getLatestNews(lang: Locale, limit: number) {
	const { data } = await getNews(lang, {}, limit);

	return data;
}

// Each filter lists only the values at least one news item uses, so no single option leads to an empty list. Years run
// newest first.
export async function getNewsFilterOptions(lang: Locale) {
	const { data } = await strapiGet<Collection<{ countries: Taxonomy[]; focusAreas: FilterOption[]; topic: FilterOption | null; year: { year: number } | null }>>(
		'/news',
		{
			locale: lang,
			fields: ['slug'],
			populate: {
				countries: { fields: TAXONOMY_FIELDS },
				focusAreas: { fields: [...TAXONOMY_FIELDS, 'order'] },
				topic: { fields: [...TAXONOMY_FIELDS, 'order'] },
				year: { fields: ['year'] },
			},
			pagination: { page: 1, pageSize: 100 },
		},
		['news-item'],
	);
	const byOrder = (a: FilterOption, b: FilterOption) => (a.order ?? 0) - (b.order ?? 0);
	const years = [...new Set(data.flatMap((item) => (item.year ? [item.year.year] : [])))].sort((a, b) => b - a);

	return {
		countries: uniqueBySlug(data.flatMap((item) => item.countries)).sort((a, b) => a.name.localeCompare(b.name, lang)),
		focusAreas: uniqueBySlug(data.flatMap((item) => item.focusAreas)).sort(byOrder),
		topics: uniqueBySlug(data.map((item) => item.topic)).sort(byOrder),
		years: years.map((year) => String(year)),
	};
}

export async function getNewsItem(lang: Locale, slug: string) {
	const { data } = await strapiGet<Collection<NewsDetail>>(
		'/news',
		{
			locale: lang,
			fields: [...CARD_FIELDS, 'excerpt', 'coverCaption'],
			filters: { slug: { $eq: slug } },
			populate: {
				...CARD_POPULATE,
				topic: { fields: TAXONOMY_FIELDS },
				countries: { fields: TAXONOMY_FIELDS },
				focusAreas: { fields: TAXONOMY_FIELDS },
				body: {
					on: {
						'shared.text-section': true,
						'shared.media': { populate: { file: { fields: MEDIA_FIELDS } } },
						'shared.media-row': { populate: { items: { populate: { file: { fields: MEDIA_FIELDS } } } } },
						'shared.testimonial': { populate: { photo: { fields: MEDIA_FIELDS } } },
						'shared.stat-row': { populate: { items: true } },
						'shared.highlight': { populate: { quote: { populate: { photo: { fields: MEDIA_FIELDS } } } } },
					},
				},
				seo: true,
			},
			pagination: { page: 1, pageSize: 1 },
		},
		['news-item'],
	);

	return data[0] ?? null;
}

// Slugs are per locale, so each language lists its own.
export async function getNewsSlugs(lang: Locale) {
	const { data } = await strapiGet<Collection<{ slug: string }>>('/news', { locale: lang, fields: ['slug'], pagination: { page: 1, pageSize: 100 } }, ['news-item']);

	return data.map((item) => item.slug);
}

// More news: items on the same topic first, then from the same countries, then the same focus areas, then the latest, so the
// list is never empty while there is other news.
export async function getRelatedNews(lang: Locale, item: NewsDetail, limit: number) {
	const query = (filters: Record<string, { slug: { $eq: string } | { $in: string[] } }> = {}) =>
		strapiGet<Collection<NewsCard>>(
			'/news',
			{
				locale: lang,
				fields: CARD_FIELDS,
				filters: { ...filters, slug: { $ne: item.slug } },
				populate: CARD_POPULATE,
				sort: SORT,
				pagination: { page: 1, pageSize: limit },
			},
			['news-item'],
		);
	const slugs = (terms: Taxonomy[]) => terms.map((term) => term.slug);

	const results = await Promise.all([
		item.topic ? query({ topic: { slug: { $eq: item.topic.slug } } }) : null,
		item.countries.length > 0 ? query({ countries: { slug: { $in: slugs(item.countries) } } }) : null,
		item.focusAreas.length > 0 ? query({ focusAreas: { slug: { $in: slugs(item.focusAreas) } } }) : null,
		query(),
	]);

	return uniqueBySlug(results.flatMap((result) => result?.data ?? [])).slice(0, limit);
}
