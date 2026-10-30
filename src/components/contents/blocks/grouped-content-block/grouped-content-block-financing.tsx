import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import type { FinancingGroup } from '@/lib/data/projects';

type GroupedContentBlockFinancingProps = { heading: CollectionHeading; groups: FinancingGroup[] };

// A project's financing, one list per group ("Total project financing", "LLF grant financing"). A line linked to a
// partner names it under its short label, in the page's language.
export default function GroupedContentBlockFinancing({ heading, groups }: GroupedContentBlockFinancingProps) {
	if (groups.length === 0) return null;

	return (
		<div className="grouped-content-block financing" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				classes="center-aligned"
				heading={heading}
				body={
					<div className="groups">
						{groups.map((group) => (
							<section key={group.heading} className="group">
								<h3 className="rsg-group-title">{group.heading}</h3>

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
				}
			/>
		</div>
	);
}
