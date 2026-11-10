import { Fragment } from 'react';
import Link from 'next/link';
import { collectionHeading, viewAllLink } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import ListingBlockStandard from '@/components/contents/blocks/listing-block/listing-block-standard';
import PartnersBlockStandard from '@/components/contents/blocks/partners-block/partners-block-standard';
import NewsTileList from '@/components/contents/post-types/tiles/news/news-list';
import ProjectTileStandard from '@/components/contents/post-types/tiles/project/project-standard';
import ResourceTileStandard from '@/components/contents/post-types/tiles/resource/resource-standard';
import { resolveHref, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPartners } from '@/lib/data/about';
import type { ListingBlock as ListingBlockData } from '@/lib/data/blocks';
import { getLatestNews } from '@/lib/data/news';

type ListingBlockProps = { lang: Locale; block: ListingBlockData; id: string };

const DEFAULT_NEWS_COUNT = 3;

// A listing block from the CMS. The post type picks the tiles and where they come from (the projects and resources
// picked in the CMS, the latest news, every partner); the layout picks a grid or list (standard) or a carousel; split
// sets the heading beside the tiles and centred centres it, as Radstone's listing item styles do.
export default async function ListingBlock({ lang, block, id }: ListingBlockProps) {
	const { heading, settings, postType, layout } = block;
	const dictionary = await getDictionary(lang);
	const wrapper = settingsWrapperProps(settings);
	const palette = settings?.brand === 'dark' ? 'dark' : 'light';
	const classes = [block.split && 'split-view', block.centred && 'center-aligned'].filter(Boolean).join(' ') || undefined;
	const blockHeading = collectionHeading(heading, id);

	// The partner logos are a grid of their own at every layout, with all the heading's links below it.
	if (postType === 'partner') {
		const partners = await getPartners(lang);
		if (partners.length === 0) return null;

		return (
			<BaseWrapper {...wrapper}>
				<PartnersBlockStandard
					heading={blockHeading}
					partners={partners}
					palette={settings?.brand ?? 'light'}
					links={heading.links.map((link) => (
						<Link key={link.id} className="rsg-button" href={resolveHref(lang, link.url)}>
							{link.label}
						</Link>
					))}
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
