import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import SharingLinks from '@/components/global/sharing-links/sharing-links';
import TextWithBreaks, { withoutBreaks } from '@/components/helpers/text-with-breaks';
import { absoluteUrl, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { NewsDetail } from '@/lib/data/news';
import { formatDate } from '@/lib/format';

type NewsHeaderProps = { lang: Locale; news: NewsDetail; labels: Dictionary['story'] };

// The title, the date and share row, then the cover photo. As in the rebuild's article header and the News Detail design,
// news shows no term pills.
export default function NewsHeaderStandard({ lang, news, labels }: NewsHeaderProps) {
	const { title, slug, publishDate, coverImage, coverCaption } = news;

	return (
		<div className="header-contents news standard rsg-surface-light">
			<div className="rsg-content-wrapper">
				<h1 className="rsg-title">
					<TextWithBreaks text={title} />
				</h1>

				<div className="rsg-meta">
					{publishDate && <p className="rsg-date rsg-fa">{labels.published.replace('{date}', formatDate(lang, publishDate))}</p>}

					<div className="rsg-share">
						<p className="rsg-share-label">{labels.share}</p>
						<SharingLinks url={absoluteUrl(lang, `/news/${slug}`)} title={withoutBreaks(title)} labels={labels} />
					</div>
				</div>
			</div>

			{coverImage && (
				<div className="rsg-hero">
					{/* The photo is the largest element on load, hence preload. */}
					<MediaBlockStandard image={coverImage} caption={coverCaption} aspectRatio="3x2" sizes="(min-width: 992px) 66vw, 100vw" preload />
				</div>
			)}
		</div>
	);
}
