import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Locale } from '@/i18n/config';
import type { SearchItem } from '@/lib/data/search';
import { formatDate } from '@/lib/format';

type SearchResultTileProps = { lang: Locale; item: SearchItem };

// A search result row: the photo, then the date (stories and news), the title and a line about it (a project's summary, a
// story's project or a page's introduction). The whole row is the link.
export default function SearchResultTile({ lang, item }: SearchResultTileProps) {
	const { href, title, image, date, description } = item;

	return (
		<Link className={image ? 'tile blueprint hc-search-result' : 'tile blueprint hc-search-result no-media'} href={href}>
			{image && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={image} aspectRatio="3x2" sizes="(min-width: 768px) 160px, 100vw" alt="" />
				</div>
			)}

			<div className="rsg-content-wrapper">
				{date && (
					<time className="rsg-date rsg-fa" dateTime={date}>
						{formatDate(lang, date)}
					</time>
				)}

				<p className="rsg-title">{title}</p>

				{description && <p className="rsg-description">{description}</p>}
			</div>
		</Link>
	);
}
