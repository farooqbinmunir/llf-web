import { collectionHeading } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import MapBlockStandard from '@/components/contents/blocks/map-block/map-block-standard';
import type { Locale } from '@/i18n/config';
import { getCountries } from '@/lib/data/about';
import type { MapBlock as MapBlockData } from '@/lib/data/blocks';

type MapBlockProps = { lang: Locale; block: MapBlockData; id: string };

// A map block from the CMS: its heading and figures, with a pin for every country that has coordinates.
export default async function MapBlock({ lang, block, id }: MapBlockProps) {
	const countries = await getCountries(lang);

	return (
		<BaseWrapper {...settingsWrapperProps(block.settings)}>
			<MapBlockStandard heading={collectionHeading(block.heading, id)} stats={block.stats} countries={countries} />
		</BaseWrapper>
	);
}
