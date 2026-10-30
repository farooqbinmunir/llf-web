import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockCta from '@/components/contents/blocks/content-box-block/content-box-block-cta';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import StatisticBlockStandard from '@/components/contents/blocks/statistic-block/statistic-block-standard';
import TextBoxBlockStandard from '@/components/contents/blocks/text-box-block/text-box-block-standard';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import ProjectTileStandard from '@/components/contents/post-types/tiles/project/project-standard';
import SearchFilters from '@/components/global/search/search-filters';
import TemplateListingPage, { TemplateListingResults } from '@/components/views/template-listing-page';
import { hasLocale, localisedPath, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { getProjectFilterOptions, getProjects, getProjectsPage, type ProjectFilters } from '@/lib/data/projects';
import { readParam, withQuery, type SearchParams } from '@/lib/search-params';

const PAGE_SIZE = 6;
const FILTERS_ID = 'listing-filters';

type ListingProps = { lang: Locale; searchParams: Promise<SearchParams>; labels: Dictionary['projects'] };

// Only accepts values that exist as options, so a hand-edited URL cannot send an unknown filter to Strapi.
// With no phase in the URL the first phase is selected, matching the design's default tab.
async function readListingState(lang: Locale, searchParams: Promise<SearchParams>) {
	const [params, options] = await Promise.all([searchParams, getProjectFilterOptions(lang)]);
	const pick = (value: string | undefined, list: { slug: string }[]) => (list.some((item) => item.slug === value) ? value : undefined);
	const filters: ProjectFilters = {
		phase: pick(readParam(params.phase), options.phases) ?? options.phases[0]?.slug ?? '',
		sector: pick(readParam(params.sector), options.sectors),
		country: pick(readParam(params.country), options.countries),
		status: pick(readParam(params.status), options.statuses),
	};

	return { options, filters, page: Math.max(1, Number.parseInt(readParam(params.page) ?? '1', 10) || 1) };
}

const toOptions = (items: { slug: string; name: string }[]) => items.map((item) => ({ value: item.slug, label: item.name }));

// The phase pills: choosing one keeps the other filters and starts again from the first page.
async function PhasePills({ lang, searchParams, labels }: ListingProps) {
	const { filters, options } = await readListingState(lang, searchParams);

	return (
		<SearchFilters
			key={filters.phase}
			id="phase-filters"
			action={localisedPath(lang, '/our-projects')}
			label={labels.phases}
			hiddenFields={{ sector: filters.sector, country: filters.country, status: filters.status }}
			fields={[{ name: 'phase', label: labels.phases, render: 'radio-lozenge', value: filters.phase, options: toOptions(options.phases) }]}
		/>
	);
}

async function ProjectResults({ lang, searchParams, labels }: ListingProps) {
	const { filters, page, options } = await readListingState(lang, searchParams);
	const path = localisedPath(lang, '/our-projects');
	const { data: projects, meta } = await getProjects(lang, filters, page * PAGE_SIZE);
	const { total } = meta.pagination;

	return (
		<TemplateListingResults
			filters={
				<SearchFilters
					key={withQuery('', filters)}
					id={FILTERS_ID}
					action={path}
					label={labels.filterProjects}
					applyLabel={labels.apply}
					reset={{ label: labels.resetFilter, href: withQuery(path, { phase: filters.phase }) }}
					hiddenFields={{ phase: filters.phase }}
					fields={[
						{ name: 'sector', label: labels.sector, render: 'select', allLabel: labels.allSectors, value: filters.sector, options: toOptions(options.sectors) },
						{ name: 'country', label: labels.country, render: 'select', allLabel: labels.allCountries, value: filters.country, options: toOptions(options.countries) },
						{ name: 'status', label: labels.status, render: 'select', allLabel: labels.allStatuses, value: filters.status, options: toOptions(options.statuses) },
					]}
				/>
			}
			status={labels.showing.replace('{shown}', String(projects.length)).replace('{total}', String(total))}
			noResults={labels.noResults}
			tiles={projects.map((project) => ({ key: project.documentId, tile: <ProjectTileStandard lang={lang} project={project} palette="dark" /> }))}
			loadMore={{
				nextHref: projects.length < total ? withQuery(path, { ...filters, page: page + 1 }) : undefined,
				label: labels.loadMore,
				filters: { id: FILTERS_ID, label: labels.filterProjects },
			}}
		/>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/our-projects'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getProjectsPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function OurProjectsPage({ params, searchParams }: PageProps<'/[lang]/our-projects'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getProjectsPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	const labels = dictionary.projects;

	return (
		<>
			{page.hero && <HeaderContentsSingle hero={page.hero} />}

			{/* The pills and results read the URL's filters, so they stream in while the rest of the page is served from the static shell. */}
			<TemplateListingPage
				labelledBy="project-listing-title"
				brand="dark"
				wrapperClasses="section-wrapper-small section-rounded-top"
				header={
					<div className="row rsg-listing-header">
						<div className="col col-12 col-lg-4">
							<Suspense fallback={<div className="rsg-pills-loading" />}>
								<PhasePills lang={lang} searchParams={searchParams} labels={labels} />
							</Suspense>
						</div>

						<div className="col col-12 col-lg-8">
							<TextBoxBlockStandard lang={lang} title={page.introTitle} titleId="project-listing-title" text={page.introText} />
						</div>
					</div>
				}
			>
				<Suspense fallback={<div className="rsg-results-loading" />}>
					<ProjectResults lang={lang} searchParams={searchParams} labels={labels} />
				</Suspense>
			</TemplateListingPage>

			{page.impactStats.length > 0 && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="light">
					<GroupedContentBlockStandard
						classes="center-aligned boxed-items"
						heading={{ id: 'impact-stats-title', title: page.impactTitle, text: page.impactText }}
						colClasses="col-6 col-lg-3"
						items={page.impactStats.map((stat) => ({
							key: `${stat.value}-${stat.description}`,
							content: <StatisticBlockStandard prefix={stat.label} statistic={stat.value} footnote={stat.description} />,
						}))}
					/>
				</BaseWrapper>
			)}

			{page.cta && (
				<BaseWrapper brand="dark" backgroundImage={page.cta.image}>
					<ContentBoxBlockCta lang={lang} cta={page.cta} />
				</BaseWrapper>
			)}
		</>
	);
}
