import type { ReactNode } from 'react';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import type { Palette } from '@/components/contents/blocks/base-wrapper';
import PartnerTileLogo from '@/components/contents/post-types/tiles/partner/partner-logo';
import { groupByPartnerType, type Partner } from '@/lib/data/about';

type PartnersBlockStandardProps = {
	heading: CollectionHeading & { id: string };
	partners: Partner[];
	palette: Palette;
	// The design hides the partner type titles (Founding partners, Supporting partners) for now.
	showGroupTitles?: boolean;
	links?: ReactNode;
};

// Partner logos in a grid, one group per partner type in the types' order: two across on mobile, three from lg up.
export default function PartnersBlockStandard({ heading, partners, palette, showGroupTitles = false, links }: PartnersBlockStandardProps) {
	if (partners.length === 0) return null;

	return (
		<div className="partners-block standard" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				classes="center-aligned"
				heading={heading}
				body={groupByPartnerType(partners).map((group) => (
					<div key={group[0].partnerType?.slug ?? 'other'} className="rsg-partner-group">
						{showGroupTitles && group[0].partnerType && <h3 className="rsg-group-title">{group[0].partnerType.name}</h3>}

						<div className="row" role="list">
							{group.map((partner) => (
								<div key={partner.documentId} className="col col-6 col-lg-4" role="listitem">
									<PartnerTileLogo partner={partner} palette={palette} />
								</div>
							))}
						</div>
					</div>
				))}
				links={links}
			/>
		</div>
	);
}
