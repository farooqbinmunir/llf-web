import type { Palette } from '@/components/contents/blocks/base-wrapper';
import ResponsiveImage from '@/components/helpers/image';
import type { Partner } from '@/lib/data/about';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type PartnerTileLogoProps = { partner: Partner; palette: Palette };

// A partner's logo on a card, centred and scaled to a shared box so logos of any shape look the same size. Without a
// logo the card shows the partner's name; with one the name is kept for screen readers.
export default function PartnerTileLogo({ partner, palette }: PartnerTileLogoProps) {
	const { name, logo } = partner;

	return (
		<div className={`tile partner logo rsg-surface-${palette}-4${logo ? '' : ' no-media'}`}>
			{logo && (
				<div className="rsg-media-wrapper">
					<ResponsiveImage image={logo} aspectRatio="orig" sizes="(min-width: 992px) 240px, 40vw" alt="" />
				</div>
			)}

			<p className={logo ? 'rsg-title rsg-visually-hidden' : 'rsg-title'}>{name}</p>
		</div>
	);
}
