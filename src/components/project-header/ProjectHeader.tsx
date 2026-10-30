import Image from 'next/image';
import TextWithBreaks from '@/components/text-with-breaks/TextWithBreaks';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { ProjectDetail } from '@/lib/data/projects';
import { strapiMediaUrl } from '@/lib/strapi/client';

type ProjectHeaderProps = { lang: Locale; project: ProjectDetail; labels: Dictionary['project'] };

// "April 2019". Latin digits in every language, as the content itself uses them. Dates are stored without a time, so they are read as UTC.
const formatMonth = (lang: Locale, date: string) => new Intl.DateTimeFormat(`${lang}-u-nu-latn`, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));

export default function ProjectHeader({ lang, project, labels }: ProjectHeaderProps) {
	const { title, heroImage, focusArea, country, startDate, endDate, lastUpdated } = project;

	return (
		<header className="project-header rsg-surface-light">
			{/* The photo is the largest element on load, hence preload. */}
			{heroImage && <Image className="image" src={strapiMediaUrl(heroImage.url)} alt={heroImage.alternativeText ?? ''} width={heroImage.width} height={heroImage.height} sizes="100vw" preload />}

			<div className="container-xxl">
				<div className="content">
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
						<ul className="meta" role="list">
							{startDate && (
								<li className="dates">
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
							{lastUpdated && <li className="updated">{labels.updated.replace('{date}', formatMonth(lang, lastUpdated))}</li>}
						</ul>
					)}
				</div>
			</div>
		</header>
	);
}
