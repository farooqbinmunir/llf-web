'use client';

import { useEffect, useRef } from 'react';
import { localeDetails, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

// Media URLs arrive absolute, resolved on the server, which alone knows the CMS address.
export type PlayerSource = { file: { src: string; type: string } | null; captions: string | null; poster: string | null; embedUrl: string | null; caption: string | null };

type VideoPlayerProps = { lang: Locale; source: PlayerSource; title: string; labels: Dictionary['videoPlayer'] };

// Plyr's typings declare both `export =` and `export default`, and TypeScript resolves the first, while the ES build that is
// loaded provides only the default export. So the class is typed from the module and the default export read by hand.
type PlyrClass = typeof import('plyr');

// YouTube and Vimeo links in their common forms, reduced to the provider and the video id Plyr embeds.
function readEmbed(url: string) {
	const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
	if (youtube) return { provider: 'youtube', id: youtube[1] };

	const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vimeo) return { provider: 'vimeo', id: vimeo[1] };

	return null;
}

// An uploaded video plays in a native <video> with its poster and caption track, so it works before the script loads; a
// YouTube or Vimeo link is embedded. Plyr then adds the accessible, keyboard-operable controls, labelled in the page's
// language. The player stays left to right in Arabic, so the progress bar and time read the way media players do.
export default function VideoPlayer({ lang, source, title, labels }: VideoPlayerProps) {
	const root = useRef<HTMLDivElement>(null);
	const embed = !source.file && source.embedUrl ? readEmbed(source.embedUrl) : null;
	// Plyr names the player and an embed's frame after the title. Its typings omit the option, so it goes in the markup.
	const config = JSON.stringify({ title });

	useEffect(() => {
		const target = root.current?.querySelector<HTMLElement>('video, [data-plyr-provider]');
		if (!target) return;

		let player: InstanceType<PlyrClass> | undefined;
		let isUnmounted = false;

		// Plyr reads the document as it loads, so it is imported in the browser only.
		import('plyr').then((module) => {
			if (isUnmounted) return;

			const Player = (module as unknown as { default: PlyrClass }).default;

			player = new Player(target, {
				iconUrl: '/plyr.svg',
				controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'fullscreen'],
				settings: ['captions', 'speed'],
				captions: { active: false, language: lang },
				keyboard: { focused: true, global: false },
				i18n: labels,
			});
		});

		return () => {
			isUnmounted = true;
			player?.destroy();
		};
	}, [lang, labels]);

	if (!source.file && !embed) return null;

	const player = (
		<div ref={root} className="rsg-video" dir="ltr">
			{source.file ? (
				// The caption track is served by the CMS, another origin, so the request must be CORS-enabled for the browser to load it.
				<video data-plyr-config={config} controls playsInline preload="metadata" crossOrigin="anonymous" poster={source.poster ?? undefined}>
					<source src={source.file.src} type={source.file.type} />
					{source.captions && <track kind="captions" src={source.captions} srcLang={lang} label={localeDetails[lang].label} />}
				</video>
			) : (
				embed && <div data-plyr-config={config} data-plyr-provider={embed.provider} data-plyr-embed-id={embed.id} />
			)}
		</div>
	);

	if (!source.caption) return player;

	return (
		<figure className="rsg-figure">
			{player}
			<figcaption className="rsg-figcaption">{source.caption}</figcaption>
		</figure>
	);
}
