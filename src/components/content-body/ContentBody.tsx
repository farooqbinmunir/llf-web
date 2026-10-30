import Image from 'next/image';
import BlocksContent from '@/components/blocks-content/BlocksContent';
import PullQuote from '@/components/pull-quote/PullQuote';
import TextWithBreaks from '@/components/text-with-breaks/TextWithBreaks';
import type { Locale } from '@/i18n/config';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { BlocksNode, BodySection, Media } from '@/lib/strapi/types';

type ContentBodyProps = { lang: Locale; sections: BodySection[] };

type Highlight = Extract<BodySection, { __component: 'shared.highlight' }>;

function Figure({ file, caption, sizes }: { file: Media; caption: string | null; sizes: string }) {
	return (
		<figure className="figure">
			<Image className="image" src={strapiMediaUrl(file.url)} alt={file.alternativeText ?? ''} width={file.width} height={file.height} sizes={sizes} />
			{caption && <figcaption className="caption">{caption}</figcaption>}
		</figure>
	);
}

function TextSection({ lang, heading, body }: { lang: Locale; heading: string | null; body: BlocksNode[] | null }) {
	if (!heading && !body?.length) return null;

	return (
		<section className="text-section">
			{heading && (
				<h2 className="heading">
					<TextWithBreaks text={heading} />
				</h2>
			)}
			{body && <BlocksContent lang={lang} content={body} />}
		</section>
	);
}

function Block({ lang, section }: { lang: Locale; section: Exclude<BodySection, Highlight> }) {
	switch (section.__component) {
		case 'shared.text-section':
			return <TextSection lang={lang} heading={section.heading} body={section.body} />;

		case 'shared.media':
			return section.file && <Figure file={section.file} caption={section.caption} sizes="(min-width: 992px) 960px, 100vw" />;

		case 'shared.media-row':
			return (
				<div className="media-row">
					{section.items.map((item) => item.file && <Figure key={item.id} file={item.file} caption={item.caption} sizes="(min-width: 768px) 480px, 100vw" />)}
				</div>
			);

		case 'shared.testimonial':
			return <PullQuote testimonial={section} />;

		case 'shared.stat-row':
			return (
				<ul className="stat-row" role="list">
					{section.items.map((stat) => (
						<li key={stat.value} className="stat">
							<p className="value">{stat.value}</p>
							{stat.description && <p className="description">{stat.description}</p>}
						</li>
					))}
				</ul>
			);
	}
}

// The editor's sequence of text, photos, quotes and figures. Highlights are full-width yellow panels, so the blocks between
// them are grouped into runs that keep the page's container, and each highlight breaks out between two runs.
export default function ContentBody({ lang, sections }: ContentBodyProps) {
	if (sections.length === 0) return null;

	const groups: (Highlight | Exclude<BodySection, Highlight>[])[] = [];

	sections.forEach((section) => {
		const last = groups[groups.length - 1];

		if (section.__component === 'shared.highlight') groups.push(section);
		else if (Array.isArray(last)) last.push(section);
		else groups.push([section]);
	});

	return (
		<div className="content-body">
			{groups.map((group) =>
				Array.isArray(group) ? (
					<div key={`run-${group[0].__component}-${group[0].id}`} className="run container-xxl">
						{group.map((section) => (
							<Block key={`${section.__component}-${section.id}`} lang={lang} section={section} />
						))}
					</div>
				) : (
					<div key={`highlight-${group.id}`} className="highlight rsg-module section-rounded-top section-wrapper-small rsg-surface-yellow">
						<div className="container-xxl">
							<TextSection lang={lang} heading={group.heading} body={group.body} />
							{group.quote && <PullQuote testimonial={group.quote} />}
						</div>
					</div>
				),
			)}
		</div>
	);
}
