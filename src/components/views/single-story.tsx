import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBlocks from '@/components/contents/blocks/content-blocks';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import StoryHeaderStandard from '@/components/contents/post-types/header-contents/story/story-standard';
import StoryTileStandard from '@/components/contents/post-types/tiles/story/story-standard';
import BlocksContent from '@/components/helpers/blocks-content';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { StoryCard, StoryDetail } from '@/lib/data/stories';

type SingleStoryProps = { lang: Locale; story: StoryDetail; related: StoryCard[]; dictionary: Dictionary };

// A story page: the header in a centred column, the body built from blocks (which bring their own sections and widths),
// the story's footnotes, then related stories.
export default function SingleStory({ lang, story, related, dictionary }: SingleStoryProps) {
	const { story: labels, carousel, videoPlayer } = dictionary;

	return (
		<>
			<article className="single-article-content">
				<div className="container-xxl">
					<div className="row">
						<div className="col col-12 col-lg-8 offset-lg-2">
							<StoryHeaderStandard lang={lang} story={story} labels={labels} playerLabels={videoPlayer} />
						</div>
					</div>
				</div>

				<div className="rsg-article-body">
					<ContentBlocks lang={lang} sections={story.body} />
				</div>

				{story.footnotes && story.footnotes.length > 0 && (
					<div className="container-xxl">
						<div className="row">
							<aside className="col col-12 col-lg-6 offset-lg-3 rsg-col-footnotes" aria-label={labels.footnotes}>
								<BlocksContent lang={lang} content={story.footnotes} />
							</aside>
						</div>
					</div>
				)}
			</article>

			{related.length > 0 && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="light">
					<ListingBlockCarousel
						heading={{ id: 'related-stories-title', label: labels.relatedStories }}
						viewAll={{ label: labels.viewAllStories, href: localisedPath(lang, '/field-updates') }}
						carouselLabels={carousel}
					>
						{related.map((relatedStory) => (
							<StoryTileStandard key={relatedStory.documentId} lang={lang} story={relatedStory} palette="light" />
						))}
					</ListingBlockCarousel>
				</BaseWrapper>
			)}
		</>
	);
}
