import CaseStudyBlock from '@/components/contents/blocks/case-study-block/case-study-block';
import ContentBoxBlock from '@/components/contents/blocks/content-box-block/content-box-block';
import CountriesBlock from '@/components/contents/blocks/countries-block/countries-block';
import GroupedContentBlock from '@/components/contents/blocks/grouped-content-block/grouped-content-block';
import ListingBlock from '@/components/contents/blocks/listing-block/listing-block';
import MapBlock from '@/components/contents/blocks/map-block/map-block';
import StatisticBlock from '@/components/contents/blocks/statistic-block/statistic-block';
import type { Locale } from '@/i18n/config';
import type { Section } from '@/lib/data/blocks';

// `opensPage`: the page has no hero, so the first block's title is the page's heading (About).
type SectionsProps = { lang: Locale; sections: Section[]; opensPage?: boolean };

// A page's sections from the CMS, in the editors' order: each block by its component. The order in the list gives each
// block the id that names its region.
export default function Sections({ lang, sections, opensPage = false }: SectionsProps) {
	return sections.map((section, index) => {
		const id = `section-${index + 1}-title`;
		const key = `${section.__component}-${section.id}`;
		const isPageHeading = opensPage && index === 0;

		switch (section.__component) {
			case 'blocks.statistic':
				return <StatisticBlock key={key} block={section} id={id} isPageHeading={isPageHeading} />;
			case 'blocks.grouped-content':
				return <GroupedContentBlock key={key} lang={lang} block={section} id={id} isPageHeading={isPageHeading} />;
			case 'blocks.countries':
				return <CountriesBlock key={key} lang={lang} block={section} id={id} isPageHeading={isPageHeading} />;
			case 'blocks.map':
				return <MapBlock key={key} lang={lang} block={section} id={id} />;
			case 'blocks.content-box':
				return <ContentBoxBlock key={key} lang={lang} block={section} id={id} />;
			case 'blocks.listing':
				return <ListingBlock key={key} lang={lang} block={section} id={id} isPageHeading={isPageHeading} />;
			case 'blocks.case-study':
				return <CaseStudyBlock key={key} lang={lang} block={section} id={id} />;
			default:
				return null;
		}
	});
}
