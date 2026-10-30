import type { Locale } from '@/i18n/config';
import { uniqueBySlug } from '@/lib/data/unique-by-slug';
import { strapiGet } from '@/lib/strapi/client';
import type { BlocksNode, BodySection, CallToAction, Collection, Media, PageHero, Seo, Single, Stat, Taxonomy, Testimonial } from '@/lib/strapi/types';

export type ProjectCard = {
	documentId: string;
	title: string;
	slug: string;
	summary: string | null;
	heroImage: Media | null;
	focusArea: Taxonomy | null;
	country: Taxonomy | null;
	impact: Stat | null;
	investment: Stat | null;
};

export type FinancingGroup = {
	heading: string;
	lines: { label: string; currency: string | null; amount: string; partner: { name: string } | null }[];
};

export type ProjectDetail = ProjectCard & {
	startDate: string | null;
	endDate: string | null;
	lastUpdated: string | null;
	targetReach: Stat[];
	countryContext: BlocksNode[] | null;
	body: BodySection[];
	expectedResults: { text: string }[];
	progress: Stat[];
	financing: FinancingGroup[];
	testimonials: Testimonial[];
	seo: Seo | null;
};

export type ProjectsPage = {
	title: string;
	hero: PageHero | null;
	introTitle: string | null;
	introText: string | null;
	impactTitle: string | null;
	impactText: string | null;
	impactStats: Stat[];
	cta: CallToAction | null;
	seo: Seo | null;
};

export type ProjectFilters = { phase: string; sector?: string; country?: string; status?: string };

type FilterOption = Taxonomy & { order?: number | null };

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
const TAXONOMY_FIELDS = ['name', 'slug'];
const CARD_FIELDS = ['title', 'slug', 'summary'];
const CARD_POPULATE = {
	heroImage: { fields: MEDIA_FIELDS },
	focusArea: { fields: TAXONOMY_FIELDS },
	country: { fields: TAXONOMY_FIELDS },
	impact: true,
	investment: true,
};

export async function getProjectsPage(lang: Locale) {
	const { data } = await strapiGet<Single<ProjectsPage>>(
		'/projects-page',
		{
			locale: lang,
			populate: {
				hero: { populate: { image: { fields: MEDIA_FIELDS } } },
				impactStats: true,
				cta: { populate: { image: { fields: MEDIA_FIELDS } } },
				seo: true,
			},
		},
		['projects-page'],
	);

	return data;
}

export async function getProjects(lang: Locale, filters: ProjectFilters, limit: number) {
	return strapiGet<Collection<ProjectCard>>(
		'/projects',
		{
			locale: lang,
			fields: CARD_FIELDS,
			filters: {
				phase: { slug: { $eq: filters.phase } },
				focusArea: filters.sector ? { slug: { $eq: filters.sector } } : undefined,
				country: filters.country ? { slug: { $eq: filters.country } } : undefined,
				projectStatus: filters.status ? { slug: { $eq: filters.status } } : undefined,
			},
			populate: CARD_POPULATE,
			sort: ['title:asc'],
			pagination: { page: 1, pageSize: limit },
		},
		['project'],
	);
}

// Countries and statuses list only values that at least one project uses, so no single option leads to an empty list.
// Phases and sectors list every entry from their own collections, because the design always shows all of them.
export async function getProjectFilterOptions(lang: Locale) {
	const [phases, sectors, projects] = await Promise.all([
		strapiGet<Collection<FilterOption>>('/phases', { locale: lang, fields: TAXONOMY_FIELDS, sort: ['order:asc'] }, ['phase']),
		strapiGet<Collection<FilterOption>>('/focus-areas', { locale: lang, fields: TAXONOMY_FIELDS, filters: { isCrossCutting: { $eq: false } }, sort: ['order:asc'] }, ['focus-area']),
		strapiGet<Collection<{ country: Taxonomy | null; projectStatus: FilterOption | null }>>(
			'/projects',
			{
				locale: lang,
				fields: ['slug'],
				populate: { country: { fields: TAXONOMY_FIELDS }, projectStatus: { fields: [...TAXONOMY_FIELDS, 'order'] } },
				pagination: { page: 1, pageSize: 100 },
			},
			['project'],
		),
	]);

	return {
		phases: phases.data,
		sectors: sectors.data,
		countries: uniqueBySlug(projects.data.map((project) => project.country)).sort((a, b) => a.name.localeCompare(b.name, lang)),
		statuses: uniqueBySlug(projects.data.map((project) => project.projectStatus)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
	};
}

export async function getProject(lang: Locale, slug: string) {
	const { data } = await strapiGet<Collection<ProjectDetail>>(
		'/projects',
		{
			locale: lang,
			fields: [...CARD_FIELDS, 'startDate', 'endDate', 'lastUpdated', 'countryContext'],
			filters: { slug: { $eq: slug } },
			populate: {
				...CARD_POPULATE,
				targetReach: true,
				body: {
					on: {
						'shared.text-section': true,
						'shared.media': { populate: { file: { fields: MEDIA_FIELDS } } },
					},
				},
				expectedResults: true,
				progress: true,
				financing: { populate: { lines: { populate: { partner: { fields: ['name'] } } } } },
				testimonials: { populate: { photo: { fields: MEDIA_FIELDS } } },
				seo: true,
			},
			pagination: { page: 1, pageSize: 1 },
		},
		['project'],
	);

	return data[0] ?? null;
}

// Slugs are per locale, so each language lists its own.
export async function getProjectSlugs(lang: Locale) {
	const { data } = await strapiGet<Collection<{ slug: string }>>('/projects', { locale: lang, fields: ['slug'], pagination: { page: 1, pageSize: 100 } }, ['project']);

	return data.map((project) => project.slug);
}

// Related projects follow the design's priority: projects in the same country first, then the same focus area, then any
// other project, so the rail is never empty while there are other projects.
export async function getRelatedProjects(lang: Locale, project: ProjectDetail, limit: number) {
	const query = (filter: Record<string, { slug: { $eq: string } }> = {}) =>
		strapiGet<Collection<ProjectCard>>(
			'/projects',
			{ locale: lang, fields: CARD_FIELDS, filters: { slug: { $ne: project.slug }, ...filter }, populate: CARD_POPULATE, sort: ['title:asc'], pagination: { page: 1, pageSize: limit } },
			['project'],
		);

	const results = await Promise.all([
		project.country ? query({ country: { slug: { $eq: project.country.slug } } }) : null,
		project.focusArea ? query({ focusArea: { slug: { $eq: project.focusArea.slug } } }) : null,
		query(),
	]);

	return uniqueBySlug(results.flatMap((result) => result?.data ?? [])).slice(0, limit);
}
