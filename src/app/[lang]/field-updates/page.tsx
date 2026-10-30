import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import StoryTileStandard from '@/components/contents/post-types/tiles/story/story-standard';
import SearchFilters from '@/components/global/search/search-filters';
import TemplateListingPage, { TemplateListingResults } from '@/components/views/template-listing-page';
import { hasLocale, localisedPath, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { getStories, getStoriesPage, getStoryFilterOptions, type StoryFilters } from '@/lib/data/stories';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

const PAGE_SIZE = 9;
const FILTERS_ID = 'listing-filters';

type ListingProps = { lang: Locale; searchParams: Promise<SearchParams>; labels: Dictionary['stories'] };

// Only accepts values that exist as options, so a hand-edited URL cannot send an unknown filter to Strapi.
async function readListingState(lang: Locale, searchParams: Promise<SearchParams>) {
	const [params, options] = await Promise.all([searchParams, getStoryFilterOptions(lang)]);
	const pick = (value: string | undefined, list: { slug: string }[]) => (list.some((item) => item.slug === value) ? value : undefined);
	const filters: StoryFilters = {
		focusArea: pick(readParam(params['focus-area']), options.focusAreas),
		country: pick(readParam(params.country), options.countries),
		type: pick(readParam(params.type), options.types),
	};

	return { options, filters, page: Math.max(1, Number.parseInt(readParam(params.page) ?? '1', 10) || 1) };
}

const toOptions = (items: { slug: string; name: string }[]) => items.map((item) => ({ value: item.slug, label: item.name }));

async function StoryResults({ lang, searchParams, labels }: ListingProps) {
	const { filters, page, options } = await readListingState(lang, searchParams);
	const path = localisedPath(lang, '/field-updates');
	const query = { 'focus-area': filters.focusArea, country: filters.country, type: filters.type };
	const { data: stories, meta } = await getStories(lang, filters, page * PAGE_SIZE);
	const { total } = meta.pagination;

	return (
		<TemplateListingResults
			filters={
				<SearchFilters
					key={withQuery('', query)}
					id={FILTERS_ID}
					action={path}
					label={labels.filterStories}
					applyLabel={labels.apply}
					reset={{ label: labels.resetFilter, href: path }}
					fields={[
						{ name: 'focus-area', label: labels.focusArea, render: 'select', allLabel: labels.allFocusAreas, value: filters.focusArea, options: toOptions(options.focusAreas) },
						{ name: 'country', label: labels.country, render: 'select', allLabel: labels.allCountries, value: filters.country, options: toOptions(options.countries) },
						{ name: 'type', label: labels.storyType, render: 'select', allLabel: labels.allStoryTypes, value: filters.type, options: toOptions(options.types) },
					]}
				/>
			}
			status={labels.showing.replace('{shown}', String(stories.length)).replace('{total}', String(total))}
			noResults={labels.noResults}
			tiles={stories.map((story) => ({ key: story.documentId, tile: <StoryTileStandard lang={lang} story={story} palette="light" /> }))}
			loadMore={{
				nextHref: stories.length < total ? withQuery(path, { ...query, page: page + 1 }) : undefined,
				label: labels.loadMore,
				filters: { id: FILTERS_ID, label: labels.filterStories },
			}}
		/>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/field-updates'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getStoriesPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function FieldUpdatesPage({ params, searchParams }: PageProps<'/[lang]/field-updates'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getStoriesPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	return (
		<>
			<HeaderContentsSingle hero={page.hero ?? { eyebrow: null, title: page.title, text: null, image: null }} layout="colour" />

			{/* The results read the URL's filters, so they stream in while the header is served from the static shell. */}
			<TemplateListingPage wrapperClasses="section-wrapper-small">
				<Suspense fallback={<div className="rsg-results-loading" />}>
					<StoryResults lang={lang} searchParams={searchParams} labels={dictionary.stories} />
				</Suspense>
			</TemplateListingPage>
		</>
	);
}
