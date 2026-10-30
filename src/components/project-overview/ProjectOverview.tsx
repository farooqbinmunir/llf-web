import BlocksContent from '@/components/blocks-content/BlocksContent';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { BlocksNode, Stat } from '@/lib/strapi/types';

type ProjectOverviewProps = { lang: Locale; targetReach: Stat[]; countryContext: BlocksNode[] | null; labels: Dictionary['project'] };

// Target reach beside the country context. The design allows one to three reach figures.
export default function ProjectOverview({ lang, targetReach, countryContext, labels }: ProjectOverviewProps) {
	const hasContext = countryContext !== null && countryContext.length > 0;

	if (targetReach.length === 0 && !hasContext) return null;

	return (
		<div className="project-overview container-xxl">
			<div className="content">
				{targetReach.length > 0 && (
					<section className="column" aria-labelledby="target-reach-title">
						<h2 id="target-reach-title" className="heading">
							{labels.targetReach}
						</h2>

						<ul className="reach" role="list">
							{targetReach.map((stat) => (
								<li key={stat.value} className="stat">
									<p className="value">{stat.value}</p>
									{stat.description && <p className="description">{stat.description}</p>}
								</li>
							))}
						</ul>
					</section>
				)}

				{hasContext && (
					<section className="column" aria-labelledby="country-context-title">
						<h2 id="country-context-title" className="heading">
							{labels.countryContext}
						</h2>

						<BlocksContent lang={lang} content={countryContext} />
					</section>
				)}
			</div>
		</div>
	);
}
