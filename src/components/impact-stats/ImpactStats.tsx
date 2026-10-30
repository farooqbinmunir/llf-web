import type { Stat } from '@/lib/strapi/types';

type ImpactStatsProps = { title: string | null; text: string | null; stats: Stat[] };

export default function ImpactStats({ title, text, stats }: ImpactStatsProps) {
	return (
		<section className="impact-stats rsg-module section-rounded-top section-wrapper-small rsg-surface-light" aria-labelledby="impact-stats-title">
			<div className="container-xxl">
				<div className="intro">
					<h2 id="impact-stats-title" className="rsg-title">
						{title}
					</h2>
					{text && <p>{text}</p>}
				</div>

				<dl className="list">
					{stats.map((stat) => (
						<div key={`${stat.value}-${stat.description}`} className="item">
							{/* The description names the figure, so it is the term; the unit and value are its definition. */}
							<dt className="description">{stat.description}</dt>
							<dd className="figure">
								{stat.label && <span className="unit">{stat.label}</span>}
								<span className="value">{stat.value}</span>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
