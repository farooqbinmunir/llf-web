import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import NewsTileList from '@/components/contents/post-types/tiles/news/news-list';
import SearchFilters from '@/components/global/search/search-filters';
import TemplateListingPage, { TemplateListingResults } from '@/components/views/template-listing-page';
import { hasLocale, localisedPath, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { getNews, getNewsFilterOptions, getNewsPage, type NewsFilters } from '@/lib/data/news';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

const PAGE_SIZE = 9;
const FILTERS_ID = 'listing-filters';

type ListingProps = { lang: Locale; searchParams: Promise<SearchParams>; labels: Dictionary['news'] };

// Only accepts values that exist as options, so a hand-edited URL cannot send an unknown filter to Strapi.
async function readListingState(lang: Locale, searchParams: Promise<SearchParams>) {
	const [params, options] = await Promise.all([searchParams, getNewsFilterOptions(lang)]);
	const pick = (value: string | undefined, list: string[]) => (value && list.includes(value) ? value : undefined);
	const slugs = (items: { slug: string }[]) => items.map((item) => item.slug);
	const filters: NewsFilters = {
		country: pick(readParam(params.country), slugs(options.countries)),
		focusArea: pick(readParam(params['focus-area']), slugs(options.focusAreas)),
		topic: pick(readParam(params.topic), slugs(options.topics)),
		year: pick(readParam(params.year), options.years),
	};

	return { options, filters, page: Math.max(1, Number.parseInt(readParam(params.page) ?? '1', 10) || 1) };
}

const toOptions = (items: { slug: string; name: string }[]) => items.map((item) => ({ value: item.slug, label: item.name }));

async function NewsResults({ lang, searchParams, labels }: ListingProps) {
	const { filters, page, options } = await readListingState(lang, searchParams);
	const path = localisedPath(lang, '/news');
	const query = { country: filters.country, 'focus-area': filters.focusArea, topic: filters.topic, year: filters.year };
	const { data: news, meta } = await getNews(lang, filters, page * PAGE_SIZE);
	const { total } = meta.pagination;

	return (
		<TemplateListingResults
			filters={
				<SearchFilters
					key={withQuery('', query)}
					id={FILTERS_ID}
					action={path}
					label={labels.filterNews}
					applyLabel={labels.apply}
					reset={{ label: labels.resetFilter, href: path }}
					fields={[
						{ name: 'country', label: labels.country, render: 'select', allLabel: labels.allCountries, value: filters.country, options: toOptions(options.countries) },
						{ name: 'focus-area', label: labels.focusArea, render: 'select', allLabel: labels.allFocusAreas, value: filters.focusArea, options: toOptions(options.focusAreas) },
						{ name: 'topic', label: labels.topic, render: 'select', allLabel: labels.allTopics, value: filters.topic, options: toOptions(options.topics) },
						{ name: 'year', label: labels.year, render: 'select', allLabel: labels.allYears, value: filters.year, options: options.years.map((year) => ({ value: year, label: year })) },
					]}
				/>
			}
			status={labels.showing.replace('{shown}', String(news.length)).replace('{total}', String(total))}
			noResults={labels.noResults}
			tiles={news.map((item) => ({ key: item.documentId, tile: <NewsTileList lang={lang} news={item} /> }))}
			layout="list"
			loadMore={{
				nextHref: news.length < total ? withQuery(path, { ...query, page: page + 1 }) : undefined,
				label: labels.loadMore,
				filters: { id: FILTERS_ID, label: labels.filterNews },
			}}
		/>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/news'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getNewsPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function NewsPage({ params, searchParams }: PageProps<'/[lang]/news'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getNewsPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	return (
		<>
			<HeaderContentsSingle hero={page.hero ?? { eyebrow: null, title: page.title, text: null, image: null }} layout="colour" />

			{/* The results read the URL's filters, so they stream in while the header is served from the static shell. */}
			<TemplateListingPage wrapperClasses="section-wrapper-small">
				<Suspense fallback={<div className="rsg-results-loading" />}>
					<NewsResults lang={lang} searchParams={searchParams} labels={dictionary.news} />
				</Suspense>
			</TemplateListingPage>
		</>
	);
}
