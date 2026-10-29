import { Suspense } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/filter-bar/FilterBar';
import ProjectCard from '@/components/project-card/ProjectCard';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { getProjectFilterOptions, getProjects, type ProjectFilters } from '@/lib/data/projects';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

const PAGE_SIZE = 6;
const FILTERS_ID = 'project-filters';

type ProjectListingProps = {
	lang: Locale;
	searchParams: Promise<SearchParams>;
	labels: Dictionary['projects'];
	introTitle: string | null;
	introText: string | null;
};

type ListingState = { filters: ProjectFilters; page: number; options: Awaited<ReturnType<typeof getProjectFilterOptions>> };

// Only accepts values that exist as options, so a hand-edited URL cannot send an unknown filter to Strapi.
// With no phase in the URL the first phase is selected, matching the design's default tab.
async function readListingState(lang: Locale, searchParams: Promise<SearchParams>): Promise<ListingState> {
	const [params, options] = await Promise.all([searchParams, getProjectFilterOptions(lang)]);
	const pick = (value: string | undefined, list: { slug: string }[]) => (list.some((item) => item.slug === value) ? value : undefined);

	return {
		options,
		page: Math.max(1, Number.parseInt(readParam(params.page) ?? '1', 10) || 1),
		filters: {
			phase: pick(readParam(params.phase), options.phases) ?? options.phases[0]?.slug ?? '',
			sector: pick(readParam(params.sector), options.sectors),
			country: pick(readParam(params.country), options.countries),
			status: pick(readParam(params.status), options.statuses),
		},
	};
}

async function PhaseTabs({ lang, searchParams, labels }: Omit<ProjectListingProps, 'introTitle' | 'introText'>) {
	const { filters, options } = await readListingState(lang, searchParams);
	const path = localisedPath(lang, '/our-projects');

	return (
		<nav className="rsg-project-listing__phases" aria-label={labels.phases}>
			{options.phases.map((phase) => (
				<Link key={phase.slug} className="rsg-project-listing__phase" href={withQuery(path, { ...filters, phase: phase.slug })} aria-current={phase.slug === filters.phase ? 'true' : undefined} scroll={false}>
					{phase.name}
				</Link>
			))}
		</nav>
	);
}

async function ProjectResults({ lang, searchParams, labels }: Omit<ProjectListingProps, 'introTitle' | 'introText'>) {
	const { filters, page, options } = await readListingState(lang, searchParams);
	const path = localisedPath(lang, '/our-projects');
	const { data: projects, meta } = await getProjects(lang, filters, page * PAGE_SIZE);
	const { total } = meta.pagination;
	const toOptions = (items: { slug: string; name: string }[]) => items.map((item) => ({ value: item.slug, label: item.name }));

	return (
		<>
			<FilterBar
				key={withQuery('', filters)}
				id={FILTERS_ID}
				action={path}
				label={labels.filterProjects}
				resetLabel={labels.resetFilter}
				applyLabel={labels.apply}
				resetHref={withQuery(path, { phase: filters.phase })}
				hiddenFields={{ phase: filters.phase }}
				fields={[
					{ name: 'sector', label: labels.sector, allLabel: labels.allSectors, value: filters.sector, options: toOptions(options.sectors) },
					{ name: 'country', label: labels.country, allLabel: labels.allCountries, value: filters.country, options: toOptions(options.countries) },
					{ name: 'status', label: labels.status, allLabel: labels.allStatuses, value: filters.status, options: toOptions(options.statuses) },
				]}
			/>

			<p className="rsg-visually-hidden" aria-live="polite">
				{labels.showing.replace('{shown}', String(projects.length)).replace('{total}', String(total))}
			</p>

			{projects.length > 0 ? (
				<ul className="rsg-project-listing__grid" role="list">
					{projects.map((project) => (
						<li key={project.documentId}>
							<ProjectCard lang={lang} project={project} />
						</li>
					))}
				</ul>
			) : (
				<p className="rsg-project-listing__empty">{labels.noResults}</p>
			)}

			<div className="rsg-project-listing__more">
				{projects.length < total && (
					<Link className="rsg-button" href={withQuery(path, { ...filters, page: page + 1 })} scroll={false}>
						{labels.loadMore}
					</Link>
				)}
				<a className="rsg-button rsg-button--plain rsg-project-listing__to-filters" href={`#${FILTERS_ID}`}>
					{labels.filterProjects}
				</a>
			</div>
		</>
	);
}

export default function ProjectListing({ lang, searchParams, labels, introTitle, introText }: ProjectListingProps) {
	return (
		<section className="rsg-panel surface-dark rsg-project-listing" aria-labelledby="project-listing-title">
			<div className="rsg-container">
				<div className="rsg-project-listing__header">
					<Suspense fallback={<div className="rsg-project-listing__phases" />}>
						<PhaseTabs lang={lang} searchParams={searchParams} labels={labels} />
					</Suspense>

					<div className="rsg-project-listing__intro">
						<h2 id="project-listing-title" className="rsg-project-listing__title">
							{introTitle}
						</h2>
						{introText && <p>{introText}</p>}
					</div>
				</div>

				<Suspense fallback={<div className="rsg-project-listing__loading" />}>
					<ProjectResults lang={lang} searchParams={searchParams} labels={labels} />
				</Suspense>
			</div>
		</section>
	);
}
