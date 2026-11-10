import { Fragment } from 'react';
import { collectionHeading, viewAllLink } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockStacked from '@/components/contents/blocks/content-box-block/content-box-block-stacked';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import ListingBlockStandard from '@/components/contents/blocks/listing-block/listing-block-standard';
import NewsTileList from '@/components/contents/post-types/tiles/news/news-list';
import PersonGroupTileStandard from '@/components/contents/post-types/tiles/person-group/person-group-standard';
import ProjectTileStandard from '@/components/contents/post-types/tiles/project/project-standard';
import ResourceTileStandard from '@/components/contents/post-types/tiles/resource/resource-standard';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getFocusAreas, getGovernanceBodies } from '@/lib/data/about';
import type { ListingBlock as ListingBlockData } from '@/lib/data/blocks';
import { getLatestNews } from '@/lib/data/news';

type ListingBlockProps = { lang: Locale; block: ListingBlockData; id: string; isPageHeading?: boolean };

const DEFAULT_NEWS_COUNT = 3;

// A listing block from the CMS. The post type picks the tiles and where they come from (the projects and resources
// picked in the CMS, the latest news, every focus area or governance body); the layout picks a grid or list (standard)
// or a carousel; split sets the heading beside the tiles and centred centres it, as Radstone's listing item styles do.
export default async function ListingBlock({ lang, block, id, isPageHeading }: ListingBlockProps) {
	const { heading, settings, postType, layout } = block;
	const dictionary = await getDictionary(lang);
	const wrapper = settingsWrapperProps(settings);
	const palette = settings?.brand === 'dark' ? 'dark' : 'light';
	const itemStyles = [block.split && 'split-view', block.centred && 'center-aligned'];
	const classes = itemStyles.filter(Boolean).join(' ') || undefined;
	const blockHeading = collectionHeading(heading, id, isPageHeading);

	// Focus areas and governance bodies are boxed cards, three across, or two beside a split heading (About).
	if (postType === 'focus-area' || postType === 'person-group') {
		const items =
			postType === 'focus-area'
				? (await getFocusAreas(lang))
						.filter((area) => area.isCrossCutting === Boolean(block.crossCutting))
						.map((area) => ({ key: area.documentId, content: <ContentBoxBlockStacked icon={area.icon} title={area.name} text={area.description} palette={palette} /> }))
				: (await getGovernanceBodies(lang)).map((group) => ({
						key: group.documentId,
						content: (
							<PersonGroupTileStandard
								lang={lang}
								group={group}
								palette={group.slug === block.highlight?.slug ? 'yellow' : palette}
								readMore={dictionary.about.readMore}
							/>
						),
					}));
		if (items.length === 0) return null;

		return (
			<BaseWrapper {...wrapper}>
				<GroupedContentBlockStandard
					heading={blockHeading}
					classes={[...itemStyles, 'boxed-items'].filter(Boolean).join(' ')}
					colClasses={block.split ? 'col-12 col-md-6' : 'col-12 col-md-6 col-lg-4'}
					items={items}
				/>
			</BaseWrapper>
		);
	}

	const tiles =
		postType === 'project'
			? block.projects.map((project) => ({ key: project.documentId, tile: <ProjectTileStandard lang={lang} project={project} palette={palette} /> }))
			: postType === 'resource'
				? block.resources.map((resource) => ({
						key: resource.documentId,
						tile: <ResourceTileStandard lang={lang} resource={resource} palette={palette} labels={dictionary.library} />,
					}))
				: (await getLatestNews(lang, block.limit ?? DEFAULT_NEWS_COUNT)).map((item) => ({ key: item.documentId, tile: <NewsTileList lang={lang} news={item} /> }));

	if (tiles.length === 0) return null;

	const viewAll = viewAllLink(lang, heading);

	return (
		<BaseWrapper {...wrapper}>
			{layout === 'carousel' ? (
				<ListingBlockCarousel heading={blockHeading} viewAll={viewAll} carouselLabels={dictionary.carousel} classes={classes}>
					{tiles.map(({ key, tile }) => (
						<Fragment key={key}>{tile}</Fragment>
					))}
				</ListingBlockCarousel>
			) : (
				<ListingBlockStandard heading={blockHeading} viewAll={viewAll} classes={classes} tiles={tiles} />
			)}
		</BaseWrapper>
	);
}
