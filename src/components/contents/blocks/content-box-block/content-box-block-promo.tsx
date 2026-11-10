import Link from 'next/link';
import WrappedCollection from '@/components/contents/blocks/_blueprints/wrapped-collection';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { resolveHref, type Locale } from '@/i18n/config';
import type { ContentBox } from '@/lib/strapi/types';

type ContentBoxBlockPromoProps = { lang: Locale; block: ContentBox; id: string };

// A section that points to another page, as the home page's About us does: the label, heading and intro, then the
// text and the links, beside a photo cut to the LLF shield from lg up. Below lg the photo sits under the heading.
export default function ContentBoxBlockPromo({ lang, block, id }: ContentBoxBlockPromoProps) {
	const { label, title, text, links, media } = block.heading;

	return (
		<div className="content-box-block promo" role="region" aria-labelledby={id}>
			<WrappedCollection
				classes="shield-media"
				heading={{
					id,
					label,
					title,
					text,
					media: media && <MediaBlockStandard image={media} aspectRatio="9x10" sizes="(min-width: 992px) 480px, 66vw" alt="" />,
				}}
				body={
					<>
						{block.body && <p className="rsg-text">{block.body}</p>}

						{links.length > 0 && (
							<div className="rsg-link-list">
								{links.map((link) => (
									<Link key={link.id} className="rsg-button" href={resolveHref(lang, link.url)}>
										{link.label}
										{/* A bare "Learn more" does not say where it goes, so screen readers also hear the section's label. */}
										{label && <span className="rsg-visually-hidden">: {label}</span>}
									</Link>
								))}
							</div>
						)}
					</>
				}
			/>
		</div>
	);
}
