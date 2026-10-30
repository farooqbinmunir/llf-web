import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import type { Locale } from '@/i18n/config';
import type { Country } from '@/lib/data/about';

type CountriesBlockProps = { lang: Locale; heading: CollectionHeading; countries: Country[] };

// A region with more countries than this spans two columns, with its list in two columns.
const WIDE_REGION = 10;

// Countries of operation grouped by region, in the regions' order, each list alphabetical in the page's language. On
// mobile each region folds away under its name; from lg up the regions sit side by side and stay open.
export default function CountriesBlockStandard({ lang, heading, countries }: CountriesBlockProps) {
	const withRegion = countries.filter((country) => country.region);
	if (withRegion.length === 0) return null;

	const collator = new Intl.Collator(lang);
	const regions = [...Map.groupBy(withRegion, (country) => country.region!.slug).values()]
		.sort((a, b) => (a[0].region!.order ?? 0) - (b[0].region!.order ?? 0))
		.map((group) => ({ region: group[0].region!, countries: group.sort((a, b) => collator.compare(a.name, b.name)) }));

	return (
		<div className="countries-block standard" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				classes="center-aligned"
				heading={heading}
				body={
					<div className="rsg-regions">
						{regions.map(({ region, countries: regionCountries }) => (
							<details key={region.slug} className={regionCountries.length > WIDE_REGION ? 'rsg-region is-wide' : 'rsg-region'} open>
								<summary className="rsg-label">{region.name}</summary>

								<ul className="rsg-country-list" role="list">
									{regionCountries.map((country) => (
										<li key={country.documentId}>{country.name}</li>
									))}
								</ul>
							</details>
						))}
					</div>
				}
			/>
		</div>
	);
}
