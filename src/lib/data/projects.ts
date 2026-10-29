import type { Locale } from '@/i18n/config';
import { strapiGet } from '@/lib/strapi/client';
import type { CallToAction, Collection, Media, PageHero, Seo, Single, Stat, Taxonomy } from '@/lib/strapi/types';

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
			fields: ['title', 'slug', 'summary'],
			filters: {
				phase: { slug: { $eq: filters.phase } },
				focusArea: filters.sector ? { slug: { $eq: filters.sector } } : undefined,
				country: filters.country ? { slug: { $eq: filters.country } } : undefined,
				projectStatus: filters.status ? { slug: { $eq: filters.status } } : undefined,
			},
			populate: {
				heroImage: { fields: MEDIA_FIELDS },
				focusArea: { fields: TAXONOMY_FIELDS },
				country: { fields: TAXONOMY_FIELDS },
				impact: true,
				investment: true,
			},
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

	const unique = <T extends Taxonomy>(items: (T | null)[]) => [...new Map(items.filter((item): item is T => item !== null).map((item) => [item.slug, item])).values()];

	return {
		phases: phases.data,
		sectors: sectors.data,
		countries: unique(projects.data.map((project) => project.country)).sort((a, b) => a.name.localeCompare(b.name, lang)),
		statuses: unique(projects.data.map((project) => project.projectStatus)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
	};
}
