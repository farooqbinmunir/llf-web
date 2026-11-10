import Link from 'next/link';
import TextWithBreaks from '@/components/helpers/text-with-breaks';
import { resolveHref, type Locale } from '@/i18n/config';
import type { ContentBox } from '@/lib/strapi/types';

type ContentBoxBlockCtaProps = { lang: Locale; block: ContentBox; id: string };

// A single band: title and text beside the links from lg up, stacked on smaller screens.
export default function ContentBoxBlockCta({ lang, block, id }: ContentBoxBlockCtaProps) {
	const { title, text, links } = block.heading;

	return (
		<div className="content-box-block cta" role="region" aria-labelledby={id}>
			<div className="rsg-header">
				<h2 id={id} className="rsg-title">
					<TextWithBreaks text={title} />
				</h2>
				{text && <p className="rsg-text">{text}</p>}
			</div>

			{links.length > 0 && (
				<div className="rsg-link-list">
					{links.map((link) => (
						<Link key={link.id} className="rsg-button" href={resolveHref(lang, link.url)}>
							{link.label}
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
