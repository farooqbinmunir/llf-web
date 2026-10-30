import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { ResourceCard } from '@/lib/data/resources';
import { formatFileSize, formatMonth } from '@/lib/format';
import { strapiMediaUrl } from '@/lib/strapi/client';

// The tile takes tone 4 (card) of the palette of the section it sits in.
type ResourceTileProps = { lang: Locale; resource: ResourceCard; palette: 'dark' | 'light'; labels: Dictionary['library'] };

// The photo with the title over its foot, then the date, the file size and the action. The whole tile is the link: to the
// file itself, so its type and size are part of the link text, or to an external resource, with the corner arrow instead.
export default function ResourceTileStandard({ lang, resource, palette, labels }: ResourceTileProps) {
	const { title, publishDate, externalUrl, coverImage, file } = resource;
	const href = file ? strapiMediaUrl(file.url) : externalUrl;
	if (!href) return null;

	const classes = ['tile', 'resource', 'standard', `rsg-surface-${palette}-4`, !file && 'external', !coverImage && 'no-media'].filter(Boolean).join(' ');

	return (
		<a className={classes} href={href} target="_blank" rel="noopener noreferrer">
			<div className="rsg-media-wrapper">
				{coverImage && <MediaBlockStandard image={coverImage} aspectRatio="3x2" sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 90vw" alt="" />}
				<p className="rsg-title">{title}</p>
			</div>

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
		</a>
	);
}
