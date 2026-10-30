import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { localisedPath, type Locale } from '@/i18n/config';
import type { NewsCard } from '@/lib/data/news';
import { formatDate } from '@/lib/format';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type NewsTileProps = { lang: Locale; news: NewsCard; palette: 'dark' | 'light' };

// A news card for carousels, such as Latest announcements: the date and title beside the photo from md up, above it on
// mobile, with the corner arrow. The whole tile is the link.
export default function NewsTileSlide({ lang, news, palette }: NewsTileProps) {
	const { title, slug, publishDate, coverImage } = news;
	const classes = ['tile', 'news', 'slide', `rsg-surface-${palette}-4`, !coverImage && 'no-media'].filter(Boolean).join(' ');

	return (
		<Link className={classes} href={localisedPath(lang, `/news/${slug}`)}>
			{coverImage && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={coverImage} aspectRatio="3x2" sizes="(min-width: 768px) 15vw, 85vw" alt="" />
				</div>
			)}

			{publishDate && (
				<time className="rsg-date" dateTime={publishDate}>
					{formatDate(lang, publishDate)}
				</time>
			)}

			<p className="rsg-title">{title}</p>

			<span className="rsg-tile-icon" aria-hidden="true" />
		</Link>
	);
}
