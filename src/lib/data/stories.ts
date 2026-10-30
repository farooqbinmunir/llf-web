import type { Locale } from '@/i18n/config';
import { uniqueBySlug } from '@/lib/data/unique-by-slug';
import { strapiGet } from '@/lib/strapi/client';
import type { BlocksNode, BodySection, Collection, Media, PageHero, Seo, Single, Taxonomy } from '@/lib/strapi/types';

export type StoryCard = {
	documentId: string;
	title: string;
	slug: string;
	coverImage: Media | null;
	focusArea: Taxonomy | null;
	country: Taxonomy | null;
	storyType: Taxonomy | null;
	project: { title: string; slug: string } | null;
};

// An uploaded file plays in the site's player; a URL is a YouTube or Vimeo video.
export type StoryVideo = {
	url: string | null;
	file: { url: string; mime: string } | null;
	captions: { url: string } | null;
	poster: Media | null;
	caption: string | null;
};

export type StoryDetail = StoryCard & {
	excerpt: string | null;
	coverCaption: string | null;
	publishDate: string | null;
	video: StoryVideo | null;
	body: BodySection[];
	footnotes: BlocksNode[] | null;
	seo: Seo | null;
};

export type StoriesPage = {
	title: string;
	hero: PageHero | null;
	seo: Seo | null;
};

export type StoryFilters = { focusArea?: string; country?: string; type?: string };

type FilterOption = Taxonomy & { order?: number | null };

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
const TAXONOMY_FIELDS = ['name', 'slug'];
const CARD_FIELDS = ['title', 'slug'];
const CARD_POPULATE = {
	coverImage: { fields: MEDIA_FIELDS },
	focusArea: { fields: TAXONOMY_FIELDS },
	country: { fields: TAXONOMY_FIELDS },
	storyType: { fields: TAXONOMY_FIELDS },
	project: { fields: ['title', 'slug'] },
};
// Newest first; the title breaks ties so pages never overlap.
const SORT = ['publishDate:desc', 'title:asc'];

export async function getStoriesPage(lang: Locale) {
	const { data } = await strapiGet<Single<StoriesPage>>('/stories-page', { locale: lang, populate: { hero: true, seo: true } }, ['stories-page']);

	return data;
}

export async function getStories(lang: Locale, filters: StoryFilters, limit: number) {
	return strapiGet<Collection<StoryCard>>(
		'/stories',
		{
			locale: lang,
			fields: CARD_FIELDS,
			filters: {
				focusArea: filters.focusArea ? { slug: { $eq: filters.focusArea } } : undefined,
				country: filters.country ? { slug: { $eq: filters.country } } : undefined,
				storyType: filters.type ? { slug: { $eq: filters.type } } : undefined,
			},
			populate: CARD_POPULATE,
			sort: SORT,
			pagination: { page: 1, pageSize: limit },
		},
		['story'],
	);
}

// Each filter lists only the values at least one story uses, so no single option leads to an empty list.
export async function getStoryFilterOptions(lang: Locale) {
	const { data } = await strapiGet<Collection<{ focusArea: FilterOption | null; country: Taxonomy | null; storyType: Taxonomy | null }>>(
		'/stories',
		{
			locale: lang,
			fields: ['slug'],
			populate: { focusArea: { fields: [...TAXONOMY_FIELDS, 'order'] }, country: { fields: TAXONOMY_FIELDS }, storyType: { fields: TAXONOMY_FIELDS } },
			pagination: { page: 1, pageSize: 100 },
		},
		['story'],
	);
	const byName = (a: Taxonomy, b: Taxonomy) => a.name.localeCompare(b.name, lang);

	return {
		focusAreas: uniqueBySlug(data.map((story) => story.focusArea)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		countries: uniqueBySlug(data.map((story) => story.country)).sort(byName),
		types: uniqueBySlug(data.map((story) => story.storyType)).sort(byName),
	};
}

export async function getStory(lang: Locale, slug: string) {
	const { data } = await strapiGet<Collection<StoryDetail>>(
		'/stories',
		{
			locale: lang,
			fields: [...CARD_FIELDS, 'excerpt', 'coverCaption', 'publishDate', 'footnotes'],
			filters: { slug: { $eq: slug } },
			populate: {
				...CARD_POPULATE,
				video: { populate: { file: { fields: ['url', 'mime'] }, captions: { fields: ['url'] }, poster: { fields: MEDIA_FIELDS } } },
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
		['story'],
	);

	return data[0] ?? null;
}

// Slugs are per locale, so each language lists its own.
export async function getStorySlugs(lang: Locale) {
	const { data } = await strapiGet<Collection<{ slug: string }>>('/stories', { locale: lang, fields: ['slug'], pagination: { page: 1, pageSize: 100 } }, ['story']);

	return data.map((story) => story.slug);
}

type RelatedContext = { projectSlug?: string; country: Taxonomy | null; focusArea: Taxonomy | null; excludeSlug?: string };

// Related stories follow the design's priority: stories from the same project first, then the same country, then the same
// focus area, then the latest stories, so the rail is never empty while there are other stories.
export async function getRelatedStories(lang: Locale, context: RelatedContext, limit: number) {
	const query = (filters: Record<string, { slug: { $eq: string } }> = {}) =>
		strapiGet<Collection<StoryCard>>(
			'/stories',
			{
				locale: lang,
				fields: CARD_FIELDS,
				filters: { ...filters, slug: context.excludeSlug ? { $ne: context.excludeSlug } : undefined },
				populate: CARD_POPULATE,
				sort: SORT,
				pagination: { page: 1, pageSize: limit },
			},
			['story'],
		);

	const results = await Promise.all([
		context.projectSlug ? query({ project: { slug: { $eq: context.projectSlug } } }) : null,
		context.country ? query({ country: { slug: { $eq: context.country.slug } } }) : null,
		context.focusArea ? query({ focusArea: { slug: { $eq: context.focusArea.slug } } }) : null,
		query(),
	]);

	return uniqueBySlug(results.flatMap((result) => result?.data ?? [])).slice(0, limit);
}
