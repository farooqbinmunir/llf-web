import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Partner } from '@/lib/data/about';

type PartnerTileProps = { partner: Partner; opensInNewTab: string };

// The open panel of a partner's accordion row: the description, then the logo and the website. The row's button names
// the partner, so the logo's alternative text is its name only where a logo is shown.
export default function PartnerTileAccordion({ partner, opensInNewTab }: PartnerTileProps) {
	const { name, description, logo, website } = partner;
	const classes = ['tile', 'partner', 'accordion', !logo && 'no-media'].filter(Boolean).join(' ');
	const websiteLabel = website?.replace(/^https?:\/\//, '').replace(/\/$/, '');

	return (
		<div className={classes}>
			{description && <p className="rsg-text">{description}</p>}

			{(logo || website) && (
				<div className="rsg-footer">
					{logo && (
						<div className="rsg-media-wrapper">
							<MediaBlockStandard image={logo} aspectRatio="orig" sizes="240px" alt={name} />
						</div>
					)}

					{website && (
						<a className="rsg-link" href={website} target="_blank" rel="noopener noreferrer">
							{websiteLabel}
							<span className="rsg-visually-hidden"> {opensInNewTab}</span>
						</a>
					)}
				</div>
			)}
		</div>
	);
}
