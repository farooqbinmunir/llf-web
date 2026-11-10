import Link from 'next/link';
import { collectionHeading } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import PartnersBlockAccordion from '@/components/contents/blocks/partners-block/partners-block-accordion';
import PartnersBlockStandard from '@/components/contents/blocks/partners-block/partners-block-standard';
import { resolveHref, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPartners } from '@/lib/data/about';
import type { PartnersBlock as PartnersBlockData } from '@/lib/data/blocks';

type PartnersBlockProps = { lang: Locale; block: PartnersBlockData; id: string; isPageHeading?: boolean };

// The accordion sits in the middle two-thirds of the page, as designed.
const NARROW_COLUMN = 'col-12 col-lg-8 offset-lg-2';

// A partners block from the CMS: every partner, as logos with the heading's links below them (standard, Home) or one
// open at a time with its description and website (accordion, About).
export default async function PartnersBlock({ lang, block, id, isPageHeading }: PartnersBlockProps) {
	const [partners, dictionary] = await Promise.all([getPartners(lang), getDictionary(lang)]);
	if (partners.length === 0) return null;

	const { heading, settings } = block;
	const palette = settings?.brand ?? 'light';
	const blockHeading = collectionHeading(heading, id, isPageHeading);

	if (block.layout === 'accordion') {
		return (
			<BaseWrapper {...settingsWrapperProps(settings)} colClasses={NARROW_COLUMN}>
				<PartnersBlockAccordion id={`${id}-accordion`} heading={blockHeading} partners={partners} palette={palette} opensInNewTab={dictionary.about.opensInNewTab} />
			</BaseWrapper>
		);
	}

	return (
		<BaseWrapper {...settingsWrapperProps(settings)}>
			<PartnersBlockStandard
				heading={blockHeading}
				partners={partners}
				palette={palette}
				links={heading.links.map((link) => (
					<Link key={link.id} className="rsg-button" href={resolveHref(lang, link.url)}>
						{link.label}
					</Link>
				))}
			/>
		</BaseWrapper>
	);
}
