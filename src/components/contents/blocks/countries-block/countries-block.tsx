import { collectionHeading } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import CountriesBlockStandard from '@/components/contents/blocks/countries-block/countries-block-standard';
import type { Locale } from '@/i18n/config';
import { getCountries } from '@/lib/data/about';
import type { CountriesBlock as CountriesBlockData } from '@/lib/data/blocks';

type CountriesBlockProps = { lang: Locale; block: CountriesBlockData; id: string; isPageHeading?: boolean };

// A countries block from the CMS: every country by region, in the middle two-thirds of the page as designed.
export default async function CountriesBlock({ lang, block, id, isPageHeading }: CountriesBlockProps) {
	const countries = await getCountries(lang);

	return (
		<BaseWrapper {...settingsWrapperProps(block.settings)} colClasses="col-12 col-lg-8 offset-lg-2">
			<CountriesBlockStandard lang={lang} heading={collectionHeading(block.heading, id, isPageHeading)} countries={countries} />
		</BaseWrapper>
	);
}
