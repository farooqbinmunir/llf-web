import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import { localisedPath, type Locale } from '@/i18n/config';
import type { NewsCard } from '@/lib/data/news';
import { formatDate } from '@/lib/format';

type NewsTileProps = { lang: Locale; news: NewsCard };

// A news row, as in the News listing and More news: the photo, then the date and title, side by side from md up. Rows are
// ruled off from one another; the whole row is the link.
export default function NewsTileList({ lang, news }: NewsTileProps) {
	const { title, slug, publishDate, coverImage } = news;

	return (
		<Link className={coverImage ? 'tile news list' : 'tile news list no-media'} href={localisedPath(lang, `/news/${slug}`)}>
			{coverImage && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={coverImage} aspectRatio="3x2" sizes="(min-width: 992px) 15vw, (min-width: 768px) 25vw, 100vw" alt="" />
				</div>
			)}

			<div className="rsg-content-wrapper">
				{publishDate && (
					<time className="rsg-date rsg-fa" dateTime={publishDate}>
						{formatDate(lang, publishDate)}
					</time>
				)}

				<p className="rsg-title">{title}</p>
			</div>
		</Link>
	);
}
