import type { ReactNode } from 'react';
import Link from 'next/link';
import SearchResultTile from '@/components/contents/post-types/tiles/_blueprints/hc-search-result';
import ResourceSearchResultTile from '@/components/contents/post-types/tiles/resource/resource-hc-search-result';
import LoadMore from '@/components/global/navigation/load-more/load-more';
import SearchForm from '@/components/global/search/search-form';
import SearchQuickLinks from '@/components/global/search/search-quick-links';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { SearchGroup, SearchGroupKey, SearchPage } from '@/lib/data/search';
import { withQuery } from '@/lib/search-params';

type SearchProps = {
	lang: Locale;
	page: SearchPage;
	labels: Dictionary['search'];
	libraryLabels: Dictionary['library'];
	query?: string;
	// The group the type pills narrow the results to; without one, every group shows its first few results.
	type?: SearchGroupKey;
	groups: SearchGroup[];
	nextHref?: string;
};

const SEARCH_INPUT_ID = 'search-page-input';

function SearchWrapper({ children }: { children: ReactNode }) {
	return (
		<div className="rsg-module section-wrapper-small">
			<div className="container-xxl">
				<div className="row">
					<div className="col-12 col-lg-8 offset-lg-2">
						<div className="search-page">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Shown while a search runs, as the design's loading state.
export function SearchLoading({ label }: { label: string }) {
	return (
		<SearchWrapper>
			<p className="rsg-search-loading rsg-fa" role="status">
				<span className="rsg-visually-hidden">{label}</span>
			</p>
		</SearchWrapper>
	);
}

// The search box, then either the results (the count, a type pill per group, the results grouped by type) or, before a
// search and when one finds nothing, the editors' message and quick links.
export default function Search({ lang, page, labels, libraryLabels, query, type, groups, nextHref }: SearchProps) {
	const path = localisedPath(lang, '/search');
	const total = groups.reduce((sum, group) => sum + group.total, 0);
	const fill = (text: string, values: Record<string, string | number>) => Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), text);
	const summary = total === 0 ? labels.noResultsFor : total === 1 ? labels.resultFound : labels.resultsFound;
	const message = query ? page.noResults : page.intro;

	return (
		<SearchWrapper>
			<h1 className="rsg-visually-hidden">{page.title}</h1>

			<SearchForm key={query} lang={lang} id={SEARCH_INPUT_ID} label={labels.label} query={query} />

			{query && (
				<p className="rsg-search-summary" role="status">
					{fill(summary, { count: total, query })}
				</p>
			)}

			{total > 0 ? (
				<>
					{/* Open by default, so the pills show before hydration and without JavaScript; from lg up the toggle is hidden. */}
					<details className="rsg-search-types" open>
						<summary className="rsg-fa">{labels.filterByType}</summary>

						<nav aria-label={labels.filterByType}>
							<ul>
								<li>
									<Link className="rsg-search-type" href={withQuery(path, { q: query })} aria-current={type ? undefined : 'true'} scroll={false}>
										{fill(labels.allResults, { count: total })}
									</Link>
								</li>
								{groups.map((group) => {
									const text = fill(labels.typeCount, { count: group.total, label: labels.groups[group.key] });

									return (
										<li key={group.key}>
											{group.total > 0 ? (
												<Link className="rsg-search-type" href={withQuery(path, { q: query, type: group.key })} aria-current={group.key === type ? 'true' : undefined} scroll={false}>
													{text}
												</Link>
											) : (
												<span className="rsg-search-type" aria-disabled="true">
													{text}
												</span>
											)}
										</li>
									);
								})}
							</ul>
						</nav>
					</details>

					{groups
						.filter((group) => group.items.length > 0 && (!type || group.key === type))
						.map((group) => (
							<section key={group.key} className="rsg-search-group" aria-labelledby={`search-group-${group.key}`}>
								<h2 id={`search-group-${group.key}`} className="rsg-group-title">
									{labels.groups[group.key]}
								</h2>

								<div role="list">
									{group.kind === 'resources'
										? group.items.map((resource) => (
												<div key={resource.documentId} role="listitem">
													<ResourceSearchResultTile lang={lang} resource={resource} labels={libraryLabels} />
												</div>
											))
										: group.items.map((item) => (
												<div key={item.key} role="listitem">
													<SearchResultTile lang={lang} item={item} />
												</div>
											))}
								</div>

								{!type && group.total > group.items.length && (
									<Link className="rsg-search-view-all rsg-fa" href={withQuery(path, { q: query, type: group.key })}>
										{fill(labels.viewAll, { label: labels.groups[group.key], count: group.total })}
									</Link>
								)}
							</section>
						))}

					{type && <LoadMore nextHref={nextHref} label={labels.loadMore} />}
				</>
			) : (
				<>
					{message && <p className="rsg-search-message">{message}</p>}

					<SearchQuickLinks lang={lang} links={page.quickLinks} />
				</>
			)}
		</SearchWrapper>
	);
}
