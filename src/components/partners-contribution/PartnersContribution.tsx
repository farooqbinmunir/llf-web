import TextWithBreaks from '@/components/text-with-breaks/TextWithBreaks';
import type { FinancingGroup } from '@/lib/data/projects';

type PartnersContributionProps = { title: string; groups: FinancingGroup[] };

// The project's financing, one list per group ("Total project financing", "LLF grant financing"). A line linked to a
// partner names it under its short label, in the page's language.
export default function PartnersContribution({ title, groups }: PartnersContributionProps) {
	return (
		<section className="partners-contribution rsg-module section-rounded-top section-wrapper-small rsg-surface-light" aria-labelledby="partners-contribution-title">
			<div className="container-xxl">
				<h2 id="partners-contribution-title" className="rsg-title">
					<TextWithBreaks text={title} />
				</h2>

				<div className="groups">
					{groups.map((group) => (
						<section key={group.heading} className="group">
							<h3 className="heading">{group.heading}</h3>

							<dl className="lines">
								{group.lines.map((line) => (
									<div key={line.label} className="line">
										<dt className="label">
											{line.label}
											{line.partner && <span className="partner">{line.partner.name}</span>}
										</dt>
										<dd className="amount">
											{line.currency && <span className="currency">{line.currency}</span>}
											<span className="value">{line.amount}</span>
										</dd>
									</div>
								))}
							</dl>
						</section>
					))}
				</div>
			</div>
		</section>
	);
}
