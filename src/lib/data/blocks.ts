import { PROJECT_CARD_QUERY, type ProjectCard } from '@/lib/data/projects';
import { RESOURCE_CARD_QUERY, type ResourceCard } from '@/lib/data/resources';
import { STORY_CARD_QUERY, type StoryCard } from '@/lib/data/stories';
import type { BlockHeading, BlockSettings, ContentBox, Stat } from '@/lib/strapi/types';

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];

// What every block's heading and settings need.
const HEADING_QUERY = { populate: { links: true, media: { fields: MEDIA_FIELDS } } };
const SETTINGS_QUERY = { populate: { backgroundImage: { fields: MEDIA_FIELDS } } };

export const CONTENT_BOX_QUERY = { populate: { heading: HEADING_QUERY, settings: SETTINGS_QUERY } };

export type MapBlock = { __component: 'blocks.map'; id: number; heading: BlockHeading; stats: Stat[]; settings: BlockSettings | null };

// Posts of one type: projects and resources are picked in the CMS; news is the latest `limit`; partners are all of them.
export type ListingBlock = {
	__component: 'blocks.listing';
	id: number;
	layout: 'standard' | 'carousel';
	postType: 'project' | 'news' | 'resource' | 'partner';
	projects: ProjectCard[];
	resources: ResourceCard[];
	limit: number | null;
	split: boolean | null;
	centred: boolean | null;
	heading: BlockHeading;
	settings: BlockSettings | null;
};

export type CaseStudyBlock = { __component: 'blocks.case-study'; id: number; heading: BlockHeading; stories: StoryCard[] };

export type Section = MapBlock | (ContentBox & { __component: 'blocks.content-box'; id: number }) | ListingBlock | CaseStudyBlock;

// A page's `sections` dynamic zone, each block with what it renders. A function, because the card queries come from
// modules that import this one.
export const sectionsQuery = () => ({
	on: {
		'blocks.map': { populate: { heading: HEADING_QUERY, stats: true, settings: SETTINGS_QUERY } },
		'blocks.content-box': CONTENT_BOX_QUERY,
		'blocks.listing': { populate: { heading: HEADING_QUERY, settings: SETTINGS_QUERY, projects: PROJECT_CARD_QUERY, resources: RESOURCE_CARD_QUERY } },
		'blocks.case-study': { populate: { heading: HEADING_QUERY, stories: STORY_CARD_QUERY } },
	},
});
