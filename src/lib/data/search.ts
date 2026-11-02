import { localisedPath, type Locale } from '@/i18n/config';
import { SEO_QUERY } from '@/lib/data/global';
import { getPages } from '@/lib/data/pages';
import { PROJECT_CARD_QUERY, type ProjectCard } from '@/lib/data/projects';
import { RESOURCE_CARD_QUERY, type ResourceCard } from '@/lib/data/resources';
import { strapiGet } from '@/lib/strapi/client';
import type { BlocksNode, Collection, Media, PageHero, Seo, Single } from '@/lib/strapi/types';

export type SearchPage = {
	title: string;
	intro: string | null;
	noResults: string | null;
	quickLinks: { id: number; title: string; text: string | null; linkUrl: string }[];
	seo: Seo | null;
};

// A matching story, news item or page, in the shape of a search result row.
export type SearchItem = {
	key: string;
	href: string;
	title: string;
	image: Media | null;
	date: string | null;
	description: string | null;
};

export type SearchGroup =
	| { key: SearchGroupKey; kind: 'items'; total: number; items: SearchItem[] }
	| { key: SearchGroupKey; kind: 'resources'; total: number; items: ResourceCard[] };

// Groups in the order the design lists them. Stories are split by their story type, as the design's Case studies, Success
// stories and Videos; the keys are the URL's `type` values.
export const SEARCH_GROUPS = ['projects', 'case-studies', 'success-stories', 'videos', 'news', 'library', 'pages'] as const;

export type SearchGroupKey = (typeof SEARCH_GROUPS)[number];

const STORY_TYPES: Partial<Record<SearchGroupKey, string>> = { 'case-studies': 'case-study', 'success-stories': 'success-story', videos: 'video' };

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
// Newest first; the title breaks ties so pages never overlap.
const SORT = ['publishDate:desc', 'title:asc'];

type StoryResult = { documentId: string; title: string; slug: string; publishDate: string | null; coverImage: Media | null; project: { title: string } | null };
type NewsResult = { documentId: string; title: string; slug: string; publishDate: string | null; coverImage: Media | null };
type Filter = { [key: string]: Filter | string };

// Matches the query anywhere in any of the fields, ignoring case; a dotted field ("country.name") filters on a relation.
// Each post type is also found by the names of its countries and focus areas, so searching "Uganda" or "Agriculture"
// finds the work filed under them.
const anyOf = (query: string, fields: string[]) => ({
	$or: fields.map((field) => field.split('.').reduceRight<Filter>((filter, part) => ({ [part]: filter }), { $containsi: query })),
});

export async function getSearchPage(lang: Locale) {
	const { data } = await strapiGet<Single<SearchPage>>('/search-page', { locale: lang, populate: { quickLinks: true, seo: SEO_QUERY } }, ['search-page']);

	return data;
}

async function searchProjects(lang: Locale, query: string, limit: number) {
	const { data, meta } = await strapiGet<Collection<ProjectCard>>(
		'/projects',
		{
			locale: lang,
			...PROJECT_CARD_QUERY,
			filters: anyOf(query, ['title', 'summary', 'country.name', 'focusArea.name']),
			sort: ['title:asc'],
			pagination: { page: 1, pageSize: limit },
		},
		['project'],
	);

	const items = data.map(({ documentId, title, slug, summary, heroImage }) => ({ key: documentId, href: localisedPath(lang, `/our-projects/${slug}`), title, image: heroImage, date: null, description: summary }));

	return { total: meta.pagination.total, items };
}

// A story's row names its project, as the design shows.
async function searchStories(lang: Locale, query: string, storyType: string, limit: number) {
	const { data, meta } = await strapiGet<Collection<StoryResult>>(
		'/stories',
		{
			locale: lang,
			fields: ['title', 'slug', 'publishDate'],
			filters: { ...anyOf(query, ['title', 'excerpt', 'country.name', 'focusArea.name', 'project.title']), storyType: { slug: { $eq: storyType } } },
			populate: { coverImage: { fields: MEDIA_FIELDS }, project: { fields: ['title'] } },
			sort: SORT,
			pagination: { page: 1, pageSize: limit },
		},
		['story'],
	);

	const items = data.map(({ documentId, title, slug, publishDate, coverImage, project }) => ({
		key: documentId,
		href: localisedPath(lang, `/field-updates/${slug}`),
		title,
		image: coverImage,
		date: publishDate,
		description: project?.title ?? null,
	}));

	return { total: meta.pagination.total, items };
}

async function searchNews(lang: Locale, query: string, limit: number) {
	const { data, meta } = await strapiGet<Collection<NewsResult>>(
		'/news',
		{
			locale: lang,
			fields: ['title', 'slug', 'publishDate'],
			filters: anyOf(query, ['title', 'excerpt', 'countries.name', 'focusAreas.name', 'topic.name']),
			populate: { coverImage: { fields: MEDIA_FIELDS } },
			sort: SORT,
			pagination: { page: 1, pageSize: limit },
		},
		['news-item'],
	);

	const items = data.map(({ documentId, title, slug, publishDate, coverImage }) => ({ key: documentId, href: localisedPath(lang, `/news/${slug}`), title, image: coverImage, date: publishDate, description: null }));

	return { total: meta.pagination.total, items };
}

async function searchResources(lang: Locale, query: string, limit: number) {
	const { data, meta } = await strapiGet<Collection<ResourceCard>>(
		'/resources',
		{
			locale: lang,
			...RESOURCE_CARD_QUERY,
			filters: anyOf(query, ['title', 'description', 'countries.name', 'focusAreas.name', 'resourceType.name']),
			sort: SORT,
			pagination: { page: 1, pageSize: limit },
		},
		['resource'],
	);

	return { total: meta.pagination.total, items: data };
}

const plainText = (blocks: BlocksNode[] | null) =>
	(blocks ?? [])
		.flatMap((block) => ('children' in block && block.type === 'paragraph' ? [block.children.map((child) => ('text' in child ? child.text : '')).join('')] : []))
		.join(' ');

// The site's own pages, each with its heading and the introduction it opens with: the page single types and the generic
// pages (privacy policy, careers). Single types cannot be filtered over REST, so the handful of pages is fetched (from the
// cache) and matched here.
async function getSitePages(lang: Locale) {
	const single = <T>(path: string, populate: Record<string, boolean>) => strapiGet<Single<T>>(path, { locale: lang, populate }, [path.slice(1)]).then(({ data }) => data);
	type WithHero = { title: string; hero: PageHero | null };

	const [about, projects, stories, library, news, contact, funding, partnerships, pages] = await Promise.all([
		single<{ title: string; intro: { text: string | null } | null }>('/about-page', { intro: true }),
		single<WithHero>('/projects-page', { hero: true }),
		single<WithHero>('/stories-page', { hero: true }),
		single<WithHero>('/library-page', { hero: true }),
		single<WithHero>('/news-page', { hero: true }),
		single<{ title: string; intro: string | null }>('/contact-page', {}),
		single<{ title: string; body: BlocksNode[] | null }>('/funding-page', {}),
		single<{ title: string; lead: string | null }>('/partnerships-page', {}),
		getPages(lang),
	]);

	return [
		about && { path: '/about-us', title: about.title, text: about.intro?.text },
		projects && { path: '/our-projects', title: projects.title, text: projects.hero?.text },
		stories && { path: '/field-updates', title: stories.title, text: stories.hero?.text },
		library && { path: '/library', title: library.title, text: library.hero?.text },
		news && { path: '/news', title: news.title, text: news.hero?.text },
		contact && { path: '/contact', title: contact.title, text: contact.intro },
		funding && { path: '/funding-queries', title: funding.title, text: plainText(funding.body) },
		partnerships && { path: '/partnerships', title: partnerships.title, text: partnerships.lead },
		...pages.map((page) => ({ path: `/${page.slug}`, title: page.title, text: page.intro })),
	].filter((page) => !!page);
}

async function searchPages(lang: Locale, query: string, limit: number) {
	const needle = query.toLocaleLowerCase(lang);
	// Headings may hold manual line breaks (a new line, or | for mobile only), which a result row does not keep.
	const matches = (await getSitePages(lang))
		.map((page) => ({ ...page, title: page.title.replace(/\s*[\n|]\s*/g, ' '), text: page.text ?? null }))
		.filter((page) => `${page.title} ${page.text ?? ''}`.toLocaleLowerCase(lang).includes(needle));

	const items = matches.slice(0, limit).map((page) => ({ key: page.path, href: localisedPath(lang, page.path), title: page.title, image: null, date: null, description: page.text }));

	return { total: matches.length, items };
}

// Every group is searched, so each type pill can show its count; `limit` sets how many results each group returns.
export async function search(lang: Locale, query: string, limit: (key: SearchGroupKey) => number): Promise<SearchGroup[]> {
	return Promise.all(
		SEARCH_GROUPS.map(async (key): Promise<SearchGroup> => {
			const storyType = STORY_TYPES[key];

			if (key === 'library') return { key, kind: 'resources', ...(await searchResources(lang, query, limit(key))) };
			if (storyType) return { key, kind: 'items', ...(await searchStories(lang, query, storyType, limit(key))) };
			if (key === 'projects') return { key, kind: 'items', ...(await searchProjects(lang, query, limit(key))) };
			if (key === 'news') return { key, kind: 'items', ...(await searchNews(lang, query, limit(key))) };

			return { key, kind: 'items', ...(await searchPages(lang, query, limit(key))) };
		}),
	);
}
