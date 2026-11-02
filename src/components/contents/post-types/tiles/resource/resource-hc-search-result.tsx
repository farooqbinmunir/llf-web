import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { ResourceCard } from '@/lib/data/resources';
import { formatFileSize, formatMonth } from '@/lib/format';
import { strapiMediaUrl } from '@/lib/strapi/client';

type ResourceSearchResultTileProps = { lang: Locale; resource: ResourceCard; labels: Dictionary['library'] };

// A Library search result row: the photo, the title, then the date and size beside the action. As on the Library tile, the
// row links to the file itself, so its type and size are part of the link text, or to an external resource.
export default function ResourceSearchResultTile({ lang, resource, labels }: ResourceSearchResultTileProps) {
	const { title, publishDate, externalUrl, coverImage, file } = resource;
	const href = file ? strapiMediaUrl(file.url) : externalUrl;
	if (!href) return null;

	const classes = ['tile', 'blueprint', 'hc-search-result', 'resource', !file && 'external', !coverImage && 'no-media'].filter(Boolean).join(' ');

	return (
		<a className={classes} href={href} target="_blank" rel="noopener noreferrer">
			{coverImage && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={coverImage} aspectRatio="3x2" sizes="(min-width: 768px) 160px, 100vw" alt="" />
				</div>
			)}

			<div className="rsg-content-wrapper">
				<p className="rsg-title">{title}</p>

				<div className="rsg-footer">
					<p className="rsg-meta">
						{publishDate && (
							<time className="rsg-date rsg-fa" dateTime={publishDate}>
								{formatMonth(lang, publishDate)}
							</time>
						)}
						{file && (
							<span className="rsg-size rsg-fa">
								<span className="rsg-visually-hidden">{`${labels.fileSize} `}</span>
								{formatFileSize(lang, file.size)}
							</span>
						)}
					</p>

					<span className="rsg-action rsg-fa">{file ? labels.download.replace('{type}', file.ext.replace('.', '').toUpperCase()) : labels.view}</span>
					<span className="rsg-visually-hidden">{labels.opensInNewTab}</span>
				</div>
			</div>
		</a>
	);
}
