import Accordion from '@/components/contents/blocks/_blueprints/accordion';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import type { Palette } from '@/components/contents/blocks/base-wrapper';
import PartnerTileAccordion from '@/components/contents/post-types/tiles/partner/partner-accordion';
import type { Partner } from '@/lib/data/about';

type PartnersBlockAccordionProps = {
	id: string;
	heading: CollectionHeading;
	partners: Partner[];
	palette: Palette;
	// The design hides the partner type titles (Founding partners, Supporting partners) for now.
	showGroupTitles?: boolean;
	opensInNewTab: string;
};

// The row names the partner in full, with its short name in brackets where that adds something.
const partnerTitle = ({ name, shortName }: Partner) => (shortName && !name.includes(shortName) ? `${name} (${shortName})` : name);

// Partners as accordion rows, one group per partner type in the types' order, each row opening to the partner's
// description, logo and website. The first row of the first group starts open, as in the design.
export default function PartnersBlockAccordion({ id, heading, partners, palette, showGroupTitles = false, opensInNewTab }: PartnersBlockAccordionProps) {
	if (partners.length === 0) return null;

	const groups = Map.groupBy(partners, (partner) => partner.partnerType?.slug ?? '');
	const sortedGroups = [...groups.values()].sort((a, b) => (a[0].partnerType?.order ?? 0) - (b[0].partnerType?.order ?? 0));

	return (
		<div id={id} className="partners-block accordion" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				classes="center-aligned"
				heading={heading}
				body={sortedGroups.map((group, index) => {
					const groupId = `${id}-${group[0].partnerType?.slug ?? 'other'}`;

					return (
						<div key={groupId} className="rsg-partner-group">
							{showGroupTitles && group[0].partnerType && <h3 className="rsg-group-title">{group[0].partnerType.name}</h3>}

							<Accordion
								id={groupId}
								palette={palette}
								openFirst={index === 0}
								items={group.map((partner) => ({
									key: partner.documentId,
									title: partnerTitle(partner),
									body: <PartnerTileAccordion partner={partner} opensInNewTab={opensInNewTab} />,
								}))}
							/>
						</div>
					);
				})}
			/>
		</div>
	);
}
