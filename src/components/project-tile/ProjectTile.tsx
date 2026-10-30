import Image from 'next/image';
import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';
import type { ProjectCard } from '@/lib/data/projects';
import { strapiMediaUrl } from '@/lib/strapi/client';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type ProjectTileProps = { lang: Locale; project: ProjectCard; palette: 'dark' | 'light' | 'yellow' };

export default function ProjectTile({ lang, project, palette }: ProjectTileProps) {
	const { title, slug, summary, heroImage, focusArea, country, impact, investment } = project;
	const facts = [impact, investment].filter((fact) => fact !== null);

	return (
		<article className={`project-tile rsg-surface-${palette}-4`}>
			<div className="header">
				{(focusArea || country) && (
					<ul className="rsg-tax-terms" role="list">
						{focusArea && <li className="rsg-tax-term">{focusArea.name}</li>}
						{country && <li className="rsg-tax-term solid">{country.name}</li>}
					</ul>
				)}

				<span className="rsg-tile-icon" aria-hidden="true" />
			</div>

			<h3 className="rsg-title">
				{/* The title link is stretched over the whole tile, so the tile is one target with the title as its name. */}
				<Link className="link" href={localisedPath(lang, `/our-projects/${slug}`)}>
					{title}
				</Link>
			</h3>

			{summary && <p className="summary">{summary}</p>}

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

			{heroImage && <Image className="image" src={strapiMediaUrl(heroImage.url)} alt="" width={heroImage.width} height={heroImage.height} sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 90vw" />}
		</article>
	);
}
