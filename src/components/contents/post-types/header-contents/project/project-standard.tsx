import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import TextWithBreaks from '@/components/helpers/text-with-breaks';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { ProjectDetail } from '@/lib/data/projects';
import { formatMonth } from '@/lib/format';

type ProjectHeaderProps = { lang: Locale; project: ProjectDetail; labels: Dictionary['project'] };

// The project's photo across the page, then its title, terms, and the date range and "updated" line between dividers.
export default function ProjectHeaderStandard({ lang, project, labels }: ProjectHeaderProps) {
	const { title, heroImage, focusArea, country, startDate, endDate, lastUpdated } = project;

	return (
		<div className="header-contents project standard rsg-surface-light">
			{/* The photo is the largest element on load, hence preload. */}
			{heroImage && (
				<div className="rsg-hero">
					<MediaBlockStandard image={heroImage} aspectRatio="12x5" sizes="100vw" preload />
				</div>
			)}

			<div className="container-xxl">
				<div className="row">
					<div className="col col-12 col-lg-8 offset-lg-2">
						<div className="rsg-content-wrapper">
							<h1 className="rsg-title">
								<TextWithBreaks text={title} />
							</h1>

							{(focusArea || country) && (
								<ul className="rsg-tax-terms" role="list">
									{focusArea && <li className="rsg-tax-term">{focusArea.name}</li>}
									{country && <li className="rsg-tax-term solid">{country.name}</li>}
								</ul>
							)}

							{(startDate || lastUpdated) && (
								<ul className="rsg-meta" role="list">
									{startDate && (
										<li className="rsg-date rsg-fa">
											<span className="rsg-visually-hidden">{labels.dates}: </span>
											<time dateTime={startDate}>{formatMonth(lang, startDate)}</time>
											{endDate && (
												<>
													{' – '}
													<time dateTime={endDate}>{formatMonth(lang, endDate)}</time>
												</>
											)}
										</li>
									)}
									{lastUpdated && <li className="rsg-updated rsg-fa">{labels.updated.replace('{date}', formatMonth(lang, lastUpdated))}</li>}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
