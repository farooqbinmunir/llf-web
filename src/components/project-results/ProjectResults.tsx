type ProjectResultsProps = {
	id: string;
	title: string;
	palette: 'dark' | 'yellow';
	items: { heading?: string; text: string | null }[];
};

// A centred heading over a two-column list of outcomes, each under a line. Serves both the expected results (text only)
// and the progress to date (a headline figure, then its description).
export default function ProjectResults({ id, title, palette, items }: ProjectResultsProps) {
	return (
		<section className={`project-results rsg-module section-rounded-top section-wrapper-small rsg-surface-${palette}`} aria-labelledby={id}>
			<div className="container-xxl">
				<h2 id={id} className="rsg-title">
					{title}
				</h2>

				<ul className="list" role="list">
					{items.map((item, index) => (
						<li key={index} className="item">
							{item.heading && <h3 className="heading">{item.heading}</h3>}
							{item.text && <p className="text">{item.text}</p>}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
