import type { Locale } from '@/i18n/config';
import { uniqueBySlug } from '@/lib/data/unique-by-slug';
import { strapiGet } from '@/lib/strapi/client';
import type { Collection, Media, Taxonomy } from '@/lib/strapi/types';

export type StoryCard = {
	documentId: string;
	title: string;
	slug: string;
	coverImage: Media | null;
	focusArea: Taxonomy | null;
	country: Taxonomy | null;
	storyType: Taxonomy | null;
	project: { title: string } | null;
};

const TAXONOMY_FIELDS = ['name', 'slug'];

// Related stories follow the design's priority: stories from the same project first, then the same country, then the same
// focus area, then the latest stories, so the rail is never empty while there are stories.
export async function getRelatedStories(lang: Locale, project: { slug: string; country: Taxonomy | null; focusArea: Taxonomy | null }, limit: number) {
	const query = (filters: Record<string, { slug: { $eq: string } }> = {}) =>
		strapiGet<Collection<StoryCard>>(
			'/stories',
			{
				locale: lang,
				fields: ['title', 'slug'],
				filters,
				populate: {
					coverImage: { fields: ['url', 'alternativeText', 'width', 'height'] },
					focusArea: { fields: TAXONOMY_FIELDS },
					country: { fields: TAXONOMY_FIELDS },
					storyType: { fields: TAXONOMY_FIELDS },
					project: { fields: ['title'] },
				},
				sort: ['publishDate:desc'],
				pagination: { page: 1, pageSize: limit },
			},
			['story'],
		);

	const results = await Promise.all([
		query({ project: { slug: { $eq: project.slug } } }),
		project.country ? query({ country: { slug: { $eq: project.country.slug } } }) : null,
		project.focusArea ? query({ focusArea: { slug: { $eq: project.focusArea.slug } } }) : null,
		query(),
	]);

	return uniqueBySlug(results.flatMap((result) => result?.data ?? [])).slice(0, limit);
}
