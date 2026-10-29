import Image from 'next/image';
import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';
import type { ProjectCard as ProjectCardData } from '@/lib/data/projects';
import { strapiMediaUrl } from '@/lib/strapi/client';

type ProjectCardProps = { lang: Locale; project: ProjectCardData };

export default function ProjectCard({ lang, project }: ProjectCardProps) {
	const { title, slug, summary, heroImage, focusArea, country, impact, investment } = project;
	const stats = [impact, investment].filter((stat) => stat !== null);

	return (
		<article className="rsg-project-card">
			<div className="rsg-project-card__tags">
				{focusArea && <span className="rsg-tag">{focusArea.name}</span>}
				{country && <span className="rsg-tag rsg-tag--dark">{country.name}</span>}
			</div>

			<h3 className="rsg-project-card__title">
				{/* The title link is stretched over the whole card, so the card is one target with the title as its name. */}
				<Link className="rsg-project-card__link" href={localisedPath(lang, `/our-projects/${slug}`)}>
					{title}
				</Link>
			</h3>

			{summary && <p className="rsg-project-card__summary">{summary}</p>}

			{stats.length > 0 && (
				<dl className="rsg-project-card__stats">
					{stats.map((stat) => (
						<div key={stat.label} className="rsg-project-card__stat">
							<dt className="rsg-project-card__stat-label">{stat.label}</dt>
							<dd className="rsg-project-card__stat-value">{stat.value}</dd>
						</div>
					))}
				</dl>
			)}

			{heroImage && (
				<Image className="rsg-project-card__image" src={strapiMediaUrl(heroImage.url)} alt="" width={heroImage.width} height={heroImage.height} sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 90vw" />
			)}
		</article>
	);
}
