import Image from 'next/image';
import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';
import type { StoryCard } from '@/lib/data/stories';
import { strapiMediaUrl } from '@/lib/strapi/client';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type StoryTileProps = { lang: Locale; story: StoryCard; palette: 'dark' | 'light' };

export default function StoryTile({ lang, story, palette }: StoryTileProps) {
	const { title, slug, coverImage, focusArea, country, storyType, project } = story;
	const isVideo = storyType?.slug === 'video';

	return (
		<article className={`story-tile rsg-surface-${palette}-4`}>
			<div className="media">
				{coverImage && <Image className="image" src={strapiMediaUrl(coverImage.url)} alt="" width={coverImage.width} height={coverImage.height} sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 85vw" />}

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

			<div className="content">
				<h3 className="rsg-title">
					{/* The title link is stretched over the whole tile, so the tile is one target with the title as its name. */}
					<Link className="link" href={localisedPath(lang, `/field-updates/${slug}`)}>
						{title}
					</Link>
				</h3>

				{project && <p className="project">{project.title}</p>}
			</div>
		</article>
	);
}
