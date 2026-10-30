import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import NewsTileSlide from '@/components/contents/post-types/tiles/news/news-slide';
import ResourceTileStandard from '@/components/contents/post-types/tiles/resource/resource-standard';
import SearchFilters from '@/components/global/search/search-filters';
import TemplateListingPage, { TemplateListingResults } from '@/components/views/template-listing-page';
import { hasLocale, localisedPath, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { getLatestNews } from '@/lib/data/news';
import { getLibraryPage, getResources, getResourceTypes } from '@/lib/data/resources';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

const PAGE_SIZE = 18;
const ANNOUNCEMENTS_COUNT = 4;
const FILTERS_ID = 'listing-filters';

type ListingProps = { lang: Locale; searchParams: Promise<SearchParams>; labels: Dictionary['library'] };

// The type pills apply on click, with "All resources" first. Only a type that exists is accepted, so a hand-edited URL
// cannot send an unknown filter to Strapi.
async function ResourceResults({ lang, searchParams, labels }: ListingProps) {
	const [params, types] = await Promise.all([searchParams, getResourceTypes(lang)]);
	const typeParam = readParam(params.type);
	const type = types.some((item) => item.slug === typeParam) ? typeParam : undefined;
	const page = Math.max(1, Number.parseInt(readParam(params.page) ?? '1', 10) || 1);
	const path = localisedPath(lang, '/library');
	const { data: resources, meta } = await getResources(lang, { type }, page * PAGE_SIZE);
	const { total } = meta.pagination;

	return (
		<TemplateListingResults
			filters={
				<SearchFilters
					key={type ?? ''}
					id={FILTERS_ID}
					action={path}
					label={labels.filterByType}
					showLabel
					className="center-aligned"
					fields={[
						{
							name: 'type',
							label: labels.resourceType,
							render: 'radio-lozenge',
							value: type ?? '',
							options: [{ value: '', label: labels.allResources }, ...types.map((item) => ({ value: item.slug, label: item.name }))],
						},
					]}
				/>
			}
			status={labels.showing.replace('{shown}', String(resources.length)).replace('{total}', String(total))}
			noResults={labels.noResults}
			tiles={resources.map((resource) => ({ key: resource.documentId, tile: <ResourceTileStandard lang={lang} resource={resource} palette="light" labels={labels} /> }))}
			loadMore={{
				nextHref: resources.length < total ? withQuery(path, { type, page: page + 1 }) : undefined,
				label: labels.loadMore,
				filters: { id: FILTERS_ID, label: labels.filterByType },
			}}
		/>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/library'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getLibraryPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function LibraryPage({ params, searchParams }: PageProps<'/[lang]/library'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary, news] = await Promise.all([getLibraryPage(lang), getDictionary(lang), getLatestNews(lang, ANNOUNCEMENTS_COUNT)]);
	if (!page) notFound();

	const { announcements } = dictionary;

	return (
		<>
			<HeaderContentsSingle hero={page.hero ?? { eyebrow: null, title: page.title, text: null, image: null }} layout="colour" />

			{/* The results read the URL's filter, so they stream in while the rest of the page is served from the static shell. */}
			<TemplateListingPage wrapperClasses="section-wrapper-small">
				<Suspense fallback={<div className="rsg-results-loading" />}>
					<ResourceResults lang={lang} searchParams={searchParams} labels={dictionary.library} />
				</Suspense>
			</TemplateListingPage>

			{news.length > 0 && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="dark">
					<ListingBlockCarousel
						heading={{ id: 'latest-announcements-title', title: announcements.title }}
						viewAll={{ label: announcements.viewAllNews, href: localisedPath(lang, '/news') }}
						carouselLabels={dictionary.carousel}
						classes="center-aligned"
						gridFrom="lg"
					>
						{news.map((item) => (
							<NewsTileSlide key={item.documentId} lang={lang} news={item} palette="dark" />
						))}
					</ListingBlockCarousel>
				</BaseWrapper>
			)}
		</>
	);
}
