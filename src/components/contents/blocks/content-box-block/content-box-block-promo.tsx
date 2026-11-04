import Link from 'next/link';
import WrappedCollection from '@/components/contents/blocks/_blueprints/wrapped-collection';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { resolveHref, type Locale } from '@/i18n/config';
import type { Promo } from '@/lib/strapi/types';

type ContentBoxBlockPromoProps = { lang: Locale; id: string; promo: Promo };

// A section that points to another page, as the home page's About us does: the label, heading and lead line, then the
// text and the link, beside a photo cut to the LLF shield from lg up. Below lg the photo sits under the heading.
export default function ContentBoxBlockPromo({ lang, id, promo }: ContentBoxBlockPromoProps) {
	const { label, title, lead, text, linkLabel, linkUrl, image } = promo;

	return (
		<div className="content-box-block promo" role="region" aria-labelledby={id}>
			<WrappedCollection
				classes="shield-media"
				heading={{
					id,
					label,
					title,
					text: lead,
					media: image && <MediaBlockStandard image={image} aspectRatio="9x10" sizes="(min-width: 992px) 480px, 66vw" alt="" />,
				}}
				body={
					<>
						{text && <p className="rsg-text">{text}</p>}

						{linkLabel && linkUrl && (
							<div className="rsg-link-list">
								<Link className="rsg-button" href={resolveHref(lang, linkUrl)}>
									{linkLabel}
									{/* A bare "Learn more" does not say where it goes, so screen readers also hear the section's label. */}
									{label && <span className="rsg-visually-hidden">: {label}</span>}
								</Link>
							</div>
						)}
					</>
				}
			/>
		</div>
	);
}
