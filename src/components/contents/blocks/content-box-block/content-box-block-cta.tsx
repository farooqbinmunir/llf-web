import Link from 'next/link';
import { resolveHref, type Locale } from '@/i18n/config';
import type { CallToAction } from '@/lib/strapi/types';

type ContentBoxBlockCtaProps = { lang: Locale; cta: CallToAction };

// A single band: title and text beside the link from lg up, stacked on smaller screens.
export default function ContentBoxBlockCta({ lang, cta }: ContentBoxBlockCtaProps) {
	const { title, text, linkLabel, linkUrl } = cta;

	return (
		<div className="content-box-block cta">
			<div className="rsg-header">
				<h2 className="rsg-title">{title}</h2>
				{text && <p className="rsg-text">{text}</p>}
			</div>

			{linkLabel && linkUrl && (
				<div className="rsg-link-list">
					<Link className="rsg-button" href={resolveHref(lang, linkUrl)}>
						{linkLabel}
					</Link>
				</div>
			)}
		</div>
	);
}
