import Link from 'next/link';
import type { Palette } from '@/components/contents/blocks/base-wrapper';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { localisedPath, type Locale } from '@/i18n/config';
import type { GovernanceBody } from '@/lib/data/about';

// The tile takes tone 4 (card) of its palette: the section's, or `yellow` for the highlighted body.
type PersonGroupTileProps = { lang: Locale; group: GovernanceBody; palette: Palette; readMore: string };

// A governance body: its name with the corner arrow, its description and "Read more", then its photo. The whole tile
// links to the body's page.
export default function PersonGroupTileStandard({ lang, group, palette, readMore }: PersonGroupTileProps) {
	const { name, slug, description, image } = group;
	const classes = ['tile', 'person-group', 'standard', `rsg-surface-${palette}-4`, !image && 'no-media'].filter(Boolean).join(' ');

	return (
		<Link className={classes} href={localisedPath(lang, `/governance/${slug}`)}>
			<div className="rsg-content-wrapper">
				<div className="rsg-header">
					<p className="rsg-title">{name}</p>
					<span className="rsg-tile-icon" aria-hidden="true" />
				</div>

				{description && <p className="rsg-description">{description}</p>}

				<span className="rsg-read-more" aria-hidden="true">
					{readMore}
				</span>
			</div>

			{image && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={image} aspectRatio="3x2" sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 90vw" alt="" />
				</div>
			)}
		</Link>
	);
}
