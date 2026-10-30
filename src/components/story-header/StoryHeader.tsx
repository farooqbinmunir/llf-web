import Image from 'next/image';
import Link from 'next/link';
import ShareLinks from '@/components/share-links/ShareLinks';
import TextWithBreaks, { withoutBreaks } from '@/components/text-with-breaks/TextWithBreaks';
import VideoPlayer from '@/components/video-player/VideoPlayer';
import { absoluteUrl, localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { StoryDetail } from '@/lib/data/stories';
import { strapiMediaUrl } from '@/lib/strapi/client';

type StoryHeaderProps = { lang: Locale; story: StoryDetail; labels: Dictionary['story']; playerLabels: Dictionary['videoPlayer'] };

// "April 20, 2026". Latin digits in every language, as the content itself uses them. Dates are stored without a time, so they are read as UTC.
const formatDate = (lang: Locale, date: string) => new Intl.DateTimeFormat(`${lang}-u-nu-latn`, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));

// A video story opens on its player; any other story opens on its title, with the cover photo below the meta line.
export default function StoryHeader({ lang, story, labels, playerLabels }: StoryHeaderProps) {
	const { title, slug, excerpt, focusArea, country, storyType, project, publishDate, coverImage, coverCaption, video } = story;
	const plainTitle = withoutBreaks(title);
	// An empty video component (no file and no link) leaves the story an ordinary one.
	const hasVideo = Boolean(video?.file || video?.url);

	return (
		<header className={hasVideo ? 'story-header rsg-surface-light is-video' : 'story-header rsg-surface-light'}>
			<div className="container-xxl">
				<div className="content">
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

					<div className="intro">
						<h1 className="rsg-title">
							<TextWithBreaks text={title} />
						</h1>
						{excerpt && <p className="excerpt">{excerpt}</p>}
					</div>

					{(focusArea || country || storyType) && (
						<ul className="rsg-tax-terms" role="list">
							{focusArea && <li className="rsg-tax-term">{focusArea.name}</li>}
							{country && <li className="rsg-tax-term solid">{country.name}</li>}
							{storyType && <li className="rsg-tax-term accent">{storyType.name}</li>}
						</ul>
					)}

					<div className="meta">
						{project && (
							<p className="project">
								<span className="rsg-visually-hidden">{labels.project}: </span>
								<Link href={localisedPath(lang, `/our-projects/${project.slug}`)}>{project.title}</Link>
							</p>
						)}

						<div className="published">
							{publishDate && <p className="date">{labels.published.replace('{date}', formatDate(lang, publishDate))}</p>}
							<ShareLinks url={absoluteUrl(lang, `/field-updates/${slug}`)} title={plainTitle} labels={labels} />
						</div>
					</div>

					{!hasVideo && coverImage && (
						<figure className="cover">
							{/* The photo is the largest element on load, hence preload. */}
							<Image className="image" src={strapiMediaUrl(coverImage.url)} alt={coverImage.alternativeText ?? ''} width={coverImage.width} height={coverImage.height} sizes="(min-width: 992px) 960px, 100vw" preload />
							{coverCaption && <figcaption className="caption">{coverCaption}</figcaption>}
						</figure>
					)}
				</div>
			</div>
		</header>
	);
}
