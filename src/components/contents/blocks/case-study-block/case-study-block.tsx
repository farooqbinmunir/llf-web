import { collectionHeading, viewAllLink } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import CaseStudyBlockStandard from '@/components/contents/blocks/case-study-block/case-study-block-standard';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import StoryTileSlide from '@/components/contents/post-types/tiles/story/story-slide';
import StoryTileStandard from '@/components/contents/post-types/tiles/story/story-standard';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { CaseStudyBlock as CaseStudyBlockData } from '@/lib/data/blocks';

type CaseStudyBlockProps = { lang: Locale; block: CaseStudyBlockData; id: string };

// Stories of change. The design has story tiles on a light section on mobile and a full-width photo slider from lg up,
// so both are rendered and each is shown at its own widths.
export default async function CaseStudyBlock({ lang, block, id }: CaseStudyBlockProps) {
	if (block.stories.length === 0) return null;

	const { home, carousel } = await getDictionary(lang);
	const viewAll = viewAllLink(lang, block.heading);

	return (
		<>
			<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top d-lg-none" brand="light">
				<ListingBlockCarousel heading={collectionHeading(block.heading, id)} viewAll={viewAll} carouselLabels={carousel}>
					{block.stories.map((story) => (
						<StoryTileStandard key={story.documentId} lang={lang} story={story} palette="light" />
					))}
				</ListingBlockCarousel>
			</BaseWrapper>

			<BaseWrapper wrapperClasses="section-rounded-top d-none d-lg-block" brand="dark" fullWidth>
				<CaseStudyBlockStandard heading={{ id: `${id}-slider`, label: block.heading.label, title: block.heading.title }} viewAll={viewAll} carouselLabels={carousel}>
					{block.stories.map((story) => (
						<StoryTileSlide key={story.documentId} lang={lang} story={story} labels={home} />
					))}
				</CaseStudyBlockStandard>
			</BaseWrapper>
		</>
	);
}
