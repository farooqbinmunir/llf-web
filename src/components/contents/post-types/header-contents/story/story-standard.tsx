import Link from 'next/link';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import SharingLinks from '@/components/global/sharing-links/sharing-links';
import TextWithBreaks, { withoutBreaks } from '@/components/helpers/text-with-breaks';
import VideoPlayer from '@/components/helpers/video-player';
import { absoluteUrl, localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { StoryDetail } from '@/lib/data/stories';
import { strapiMediaUrl } from '@/lib/strapi/client';

type StoryHeaderProps = { lang: Locale; story: StoryDetail; labels: Dictionary['story']; playerLabels: Dictionary['videoPlayer'] };

// "April 20, 2026". Latin digits in every language, as the content itself uses them. Dates are stored without a time, so they are read as UTC.
const formatDate = (lang: Locale, date: string) => new Intl.DateTimeFormat(`${lang}-u-nu-latn`, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));

// A video story opens on its player; any other story opens on its title, with the cover photo (the hero) after the meta line.
export default function StoryHeaderStandard({ lang, story, labels, playerLabels }: StoryHeaderProps) {
	const { title, slug, excerpt, focusArea, country, storyType, project, publishDate, coverImage, coverCaption, video } = story;
	const plainTitle = withoutBreaks(title);
	// An empty video component (no file and no link) leaves the story an ordinary one.
	const hasVideo = Boolean(video?.file || video?.url);

	return (
		<div className={hasVideo ? 'header-contents story standard rsg-surface-light is-video' : 'header-contents story standard rsg-surface-light'}>
			{video && hasVideo && (
				<VideoPlayer
					lang={lang}
					title={plainTitle}
					labels={playerLabels}
					source={{
						file: video.file && { src: strapiMediaUrl(video.file.url), type: video.file.mime },
						captions: video.captions && strapiMediaUrl(video.captions.url),
						poster: video.poster && strapiMediaUrl(video.poster.url),
						embedUrl: video.url,
						caption: video.caption,
					}}
				/>
			)}

			<div className="rsg-content-wrapper">
				<h1 className="rsg-title">
					<TextWithBreaks text={title} />
				</h1>

				{excerpt && <p className="rsg-introduction">{excerpt}</p>}

				{(focusArea || country || storyType) && (
					<ul className="rsg-tax-terms" role="list">
						{focusArea && <li className="rsg-tax-term">{focusArea.name}</li>}
						{country && <li className="rsg-tax-term solid">{country.name}</li>}
						{storyType && <li className="rsg-tax-term accent">{storyType.name}</li>}
					</ul>
				)}

				{project && (
					<p className="rsg-project">
						<span className="rsg-visually-hidden">{labels.project}: </span>
						<Link href={localisedPath(lang, `/our-projects/${project.slug}`)}>{project.title}</Link>
					</p>
				)}

				<div className="rsg-meta">
					{publishDate && <p className="rsg-date rsg-fa">{labels.published.replace('{date}', formatDate(lang, publishDate))}</p>}

					<div className="rsg-share">
						<p className="rsg-share-label">{labels.share}</p>
						<SharingLinks url={absoluteUrl(lang, `/field-updates/${slug}`)} title={plainTitle} labels={labels} />
					</div>
				</div>
			</div>

			{!hasVideo && coverImage && (
				<div className="rsg-hero">
					{/* The photo is the largest element on load, hence preload. */}
					<MediaBlockStandard image={coverImage} caption={coverCaption} aspectRatio="3x2" sizes="(min-width: 992px) 66vw, 100vw" preload />
				</div>
			)}
		</div>
	);
}
