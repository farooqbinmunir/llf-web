import { Suspense } from 'react';
import Link from 'next/link';
import SearchFilters from '@/components/search-filters/SearchFilters';
import StoryTile from '@/components/story-tile/StoryTile';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { getStories, getStoryFilterOptions, type StoryFilters } from '@/lib/data/stories';
import type { PageHero } from '@/lib/strapi/types';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

const PAGE_SIZE = 9;
const FILTERS_ID = 'story-filters';

type StoryListingProps = {
	lang: Locale;
	searchParams: Promise<SearchParams>;
	labels: Dictionary['stories'];
	intro: PageHero | null;
	title: string;
};

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

async function StoryResults({ lang, searchParams, labels }: Pick<StoryListingProps, 'lang' | 'searchParams' | 'labels'>) {
	const { filters, page, options } = await readListingState(lang, searchParams);
	const path = localisedPath(lang, '/field-updates');
	const query = { 'focus-area': filters.focusArea, country: filters.country, type: filters.type };
	const { data: stories, meta } = await getStories(lang, filters, page * PAGE_SIZE);
	const { total } = meta.pagination;
	const toOptions = (items: { slug: string; name: string }[]) => items.map((item) => ({ value: item.slug, label: item.name }));

	return (
		<>
			<SearchFilters
				key={withQuery('', query)}
				id={FILTERS_ID}
				action={path}
				label={labels.filterStories}
				resetLabel={labels.resetFilter}
				applyLabel={labels.apply}
				resetHref={path}
				fields={[
					{ name: 'focus-area', label: labels.focusArea, allLabel: labels.allFocusAreas, value: filters.focusArea, options: toOptions(options.focusAreas) },
					{ name: 'country', label: labels.country, allLabel: labels.allCountries, value: filters.country, options: toOptions(options.countries) },
					{ name: 'type', label: labels.storyType, allLabel: labels.allStoryTypes, value: filters.type, options: toOptions(options.types) },
				]}
			/>

			<p className="rsg-visually-hidden" aria-live="polite">
				{labels.showing.replace('{shown}', String(stories.length)).replace('{total}', String(total))}
			</p>

			{stories.length > 0 ? (
				<ul className="grid" role="list">
					{stories.map((story) => (
						<li key={story.documentId}>
							<StoryTile lang={lang} story={story} palette="light" />
						</li>
					))}
				</ul>
			) : (
				<p className="empty">{labels.noResults}</p>
			)}

			<div className="more">
				{stories.length < total && (
					<Link className="rsg-button" href={withQuery(path, { ...query, page: page + 1 })} scroll={false}>
						{labels.loadMore}
					</Link>
				)}
				<a className="filters-jump" href={`#${FILTERS_ID}`}>
					{labels.filterStories}
				</a>
			</div>
		</>
	);
}

// The page's intro, then the filters and tiles. The intro is the page heading, so the listing needs no hero.
export default function StoryListing({ lang, searchParams, labels, intro, title }: StoryListingProps) {
	return (
		<section className="story-listing rsg-module section-wrapper-small rsg-surface-light" aria-labelledby="story-listing-title">
			<div className="container-xxl">
				<div className="intro">
					{intro?.eyebrow && <p className="rsg-label">{intro.eyebrow}</p>}
					<h1 id="story-listing-title" className="rsg-title">
						{intro?.title ?? title}
					</h1>
					{intro?.text && <p className="text">{intro.text}</p>}
				</div>

				{/* The results read the URL's filters, so they stream in while the intro is served from the static shell. */}
				<Suspense fallback={<div className="loading" />}>
					<StoryResults lang={lang} searchParams={searchParams} labels={labels} />
				</Suspense>
			</div>
		</section>
	);
}
