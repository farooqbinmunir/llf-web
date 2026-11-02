import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Search, { SearchLoading } from '@/components/views/search';
import { hasLocale, localisedPath, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { getSearchPage, search, SEARCH_GROUPS, type SearchGroupKey, type SearchPage as SearchPageContent } from '@/lib/data/search';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

// Each group shows its first few results until the type pills narrow the results to it; then it pages in tens, up to
// Strapi's page size limit.
const PREVIEW_SIZE = 4;
const PAGE_SIZE = 10;
const MAX_RESULTS = 100;

type ResultsProps = { lang: Locale; page: SearchPageContent; searchParams: Promise<SearchParams>; dictionary: Dictionary };

const isGroup = (value: string | undefined): value is SearchGroupKey => SEARCH_GROUPS.some((key) => key === value);

async function SearchResults({ lang, page, searchParams, dictionary }: ResultsProps) {
	const params = await searchParams;
	const query = readParam(params.q)?.trim().slice(0, 100) || undefined;
	const requestedType = readParam(params.type);
	const type = isGroup(requestedType) ? requestedType : undefined;
	const pageNumber = Math.max(1, Number.parseInt(readParam(params.page) ?? '1', 10) || 1);
	const limit = Math.min(pageNumber * PAGE_SIZE, MAX_RESULTS);

	const groups = query ? await search(lang, query, (key) => (key === type ? limit : PREVIEW_SIZE)) : [];
	// A type without results (from a hand-edited URL) shows every group instead of an empty page.
	const activeGroup = groups.find((group) => group.key === type && group.total > 0);
	const hasMore = activeGroup && activeGroup.items.length < activeGroup.total && limit < MAX_RESULTS;

	return (
		<Search
			lang={lang}
			page={page}
			labels={dictionary.search}
			libraryLabels={dictionary.library}
			query={query}
			type={activeGroup?.key}
			groups={groups}
			nextHref={hasMore ? withQuery(localisedPath(lang, '/search'), { q: query, type, page: pageNumber + 1 }) : undefined}
		/>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/search'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getSearchPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.intro ?? undefined };
}

export default async function SearchPage({ params, searchParams }: PageProps<'/[lang]/search'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getSearchPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	// The search reads the URL's query, so it streams in while the header and footer are served from the static shell.
	return (
		<Suspense fallback={<SearchLoading label={dictionary.search.loading} />}>
			<SearchResults lang={lang} page={page} searchParams={searchParams} dictionary={dictionary} />
		</Suspense>
	);
}
