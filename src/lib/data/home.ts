import type { Locale } from '@/i18n/config';
import { CONTENT_BOX_QUERY } from '@/lib/data/blocks';
import { SEO_QUERY } from '@/lib/data/global';
import { PROJECT_CARD_QUERY, type ProjectCard } from '@/lib/data/projects';
import { RESOURCE_CARD_QUERY, type ResourceCard } from '@/lib/data/resources';
import { STORY_CARD_QUERY, type StoryCard } from '@/lib/data/stories';
import { strapiGet } from '@/lib/strapi/client';
import type { ContentBox, PageHero, SectionHeader, Seo, Single, Stat } from '@/lib/strapi/types';

export type HomePage = {
	title: string;
	hero: PageHero | null;
	impact: (SectionHeader & { stats: Stat[] }) | null;
	about: ContentBox | null;
	partners: SectionHeader | null;
	projects: SectionHeader | null;
	featuredProjects: ProjectCard[];
	stories: SectionHeader | null;
	featuredStories: StoryCard[];
	news: SectionHeader | null;
	library: SectionHeader | null;
	featuredResources: ResourceCard[];
	cta: ContentBox | null;
	seo: Seo | null;
};

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
const WITH_IMAGE = { populate: { image: { fields: MEDIA_FIELDS } } };

export async function getHomePage(lang: Locale) {
	const { data } = await strapiGet<Single<HomePage>>(
		'/home-page',
		{
			locale: lang,
			populate: {
				hero: WITH_IMAGE,
				impact: { populate: { stats: true } },
				about: CONTENT_BOX_QUERY,
				partners: true,
				projects: true,
				featuredProjects: PROJECT_CARD_QUERY,
				stories: true,
				featuredStories: STORY_CARD_QUERY,
				news: true,
				library: true,
				featuredResources: RESOURCE_CARD_QUERY,
				cta: CONTENT_BOX_QUERY,
				seo: SEO_QUERY,
			},
		},
		['home-page', 'project', 'story', 'resource'],
	);

	return data;
}
