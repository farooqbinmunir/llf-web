import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { localisedPath, type Locale } from '@/i18n/config';
import type { StoryCard } from '@/lib/data/stories';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type StoryTileProps = { lang: Locale; story: StoryCard; palette: 'dark' | 'light' };

// The photo with the corner icon and the term pills over it, then the title and the story's project. The whole tile is the link.
export default function StoryTileStandard({ lang, story, palette }: StoryTileProps) {
	const { title, slug, coverImage, focusArea, country, storyType, project } = story;
	const isVideo = storyType?.slug === 'video';
	const classes = ['tile', 'story', 'standard', `rsg-surface-${palette}-4`, isVideo && 'video', !coverImage && 'no-media'].filter(Boolean).join(' ');

	return (
		<Link className={classes} href={localisedPath(lang, `/field-updates/${slug}`)}>
			<div className="rsg-media-wrapper">
				{coverImage && <MediaBlockStandard image={coverImage} aspectRatio="1x1" sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 85vw" alt="" />}

				<span className={isVideo ? 'rsg-tile-icon play' : 'rsg-tile-icon'} aria-hidden="true" />

				{(focusArea || country || storyType) && (
					<ul className="rsg-tax-terms" role="list">
						{focusArea && <li className="rsg-tax-term">{focusArea.name}</li>}
						{(country || storyType) && (
							<li className="rsg-tax-terms-row">
								{country && <span className="rsg-tax-term solid">{country.name}</span>}
								{storyType && <span className="rsg-tax-term accent">{storyType.name}</span>}
							</li>
						)}
					</ul>
				)}
			</div>

			<div className="rsg-content-wrapper">
				<p className="rsg-title">{title}</p>
				{project && <p className="rsg-project">{project.title}</p>}
			</div>
		</Link>
	);
}
