import type { Stat } from '@/lib/strapi/types';

type ImpactStatsProps = { title: string | null; text: string | null; stats: Stat[] };

export default function ImpactStats({ title, text, stats }: ImpactStatsProps) {
	return (
		<section className="rsg-panel surface-light rsg-impact-stats" aria-labelledby="impact-stats-title">
			<div className="rsg-container">
				<div className="rsg-impact-stats__intro">
					<h2 id="impact-stats-title" className="rsg-impact-stats__title">
						{title}
					</h2>
					{text && <p>{text}</p>}
				</div>

				<dl className="rsg-impact-stats__list">
					{stats.map((stat) => (
						<div key={`${stat.value}-${stat.description}`} className="rsg-impact-stats__item">
							{/* The description names the figure, so it is the term; the unit and value are its definition. */}
							<dt className="rsg-impact-stats__description">{stat.description}</dt>
							<dd className="rsg-impact-stats__figure">
								{stat.label && <span className="rsg-impact-stats__unit">{stat.label}</span>}
								<span className="rsg-impact-stats__value">{stat.value}</span>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
