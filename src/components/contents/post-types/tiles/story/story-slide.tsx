import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { localisedPath, type Locale } from '@/i18n/config';
import type { StoryCard } from '@/lib/data/stories';

// `labels` name the link when the story type does not: a video, or a story with no type.
type StoryTileSlideProps = { lang: Locale; story: StoryCard; labels: { playVideo: string; readStory: string } };

// A story across the full width of a slider: the photo behind, with the title, the story's project and what it is
// ("Case Study", "Play video") over it, in the page's container. The whole tile is the link.
export default function StoryTileSlide({ lang, story, labels }: StoryTileSlideProps) {
	const { title, slug, coverImage, storyType, project } = story;
	const linkLabel = storyType?.slug === 'video' ? labels.playVideo : (storyType?.name ?? labels.readStory);

	return (
		<Link className={coverImage ? 'tile story slide' : 'tile story slide no-media'} href={localisedPath(lang, `/field-updates/${slug}`)}>
			{coverImage && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={coverImage} aspectRatio="orig" sizes="100vw" alt="" />
				</div>
			)}

			<div className="container-xxl">
				<div className="rsg-content-wrapper">
					<p className="rsg-title">{title}</p>
					{project && <p className="rsg-project">{project.title}</p>}
					<span className="rsg-read-more">{linkLabel}</span>
				</div>
			</div>
		</Link>
	);
}
