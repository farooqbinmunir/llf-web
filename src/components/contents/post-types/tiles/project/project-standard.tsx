import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Palette } from '@/components/contents/blocks/base-wrapper';
import { localisedPath, type Locale } from '@/i18n/config';
import type { ProjectCard } from '@/lib/data/projects';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type ProjectTileProps = { lang: Locale; project: ProjectCard; palette: Palette };

// Terms and the corner arrow, the title, summary and key facts, then the photo at the foot. The whole tile is the link.
export default function ProjectTileStandard({ lang, project, palette }: ProjectTileProps) {
	const { title, slug, summary, heroImage, focusArea, country, impact, investment } = project;
	const facts = [impact, investment].filter((fact) => fact !== null);

	return (
		<Link className={`tile project standard rsg-surface-${palette}-4${heroImage ? '' : ' no-media'}`} href={localisedPath(lang, `/our-projects/${slug}`)}>
			<div className="rsg-content-wrapper">
				<div className="rsg-header">
					{(focusArea || country) && (
						<ul className="rsg-tax-terms" role="list">
							{focusArea && <li className="rsg-tax-term">{focusArea.name}</li>}
							{country && <li className="rsg-tax-term solid">{country.name}</li>}
						</ul>
					)}

					<span className="rsg-tile-icon" aria-hidden="true" />
				</div>

				<p className="rsg-title">{title}</p>

				{summary && <p className="rsg-description">{summary}</p>}

				{facts.length > 0 && (
					<dl className="rsg-facts">
						{facts.map((fact) => (
							<div key={fact.label} className="rsg-fact">
								<dt>{fact.label}</dt>
								<dd>{fact.value}</dd>
							</div>
						))}
					</dl>
				)}
			</div>

			{heroImage && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={heroImage} aspectRatio="3x2" sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 90vw" alt="" />
				</div>
			)}
		</Link>
	);
}
