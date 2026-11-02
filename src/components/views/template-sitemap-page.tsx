import Link from 'next/link';
import WrappedCollection from '@/components/contents/blocks/_blueprints/wrapped-collection';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import { resolveHref, type Locale } from '@/i18n/config';
import type { SitemapPage, SitemapSection } from '@/lib/data/pages';

type TemplateSitemapPageProps = { lang: Locale; page: SitemapPage };

// Beyond this many links, an area's links take three columns beside a narrower sentence, as About us does in the design.
const WIDE_LINK_COUNT = 6;

// Sections with links take a row each; consecutive sections without links share a row, four across from lg up.
function toRows(sections: SitemapSection[]) {
	return sections.reduce<SitemapSection[][]>((rows, section) => {
		const last = rows.at(-1);

		if (!section.links.length && last && !last[0].links.length) last.push(section);
		else rows.push([section]);

		return rows;
	}, []);
}

function Area({ lang, section }: { lang: Locale; section: SitemapSection }) {
	const titleId = `sitemap-${section.id}`;
	const isWide = section.links.length > WIDE_LINK_COUNT;
	const hasLinks = section.links.length > 0;
	const classes = ['area', 'col', hasLinks ? 'col-12' : 'col-12 col-md-6 col-lg-3', isWide && 'wide'].filter(Boolean).join(' ');
	const text = section.text && <p className="rsg-text">{section.text}</p>;

	return (
		<section className={classes} aria-labelledby={titleId}>
			<h2 id={titleId} className="rsg-title">
				{section.linkUrl ? (
					<Link className="rsg-fa" href={resolveHref(lang, section.linkUrl)}>
						{section.title}
					</Link>
				) : (
					section.title
				)}
			</h2>

			{hasLinks ? (
				<div className="row">
					<div className={isWide ? 'col col-12 col-lg-3' : 'col col-12 col-lg-6'}>{text}</div>

					<div className={isWide ? 'col col-12 col-lg-9' : 'col col-12 col-lg-6'}>
						<ul className="rsg-link-list">
							{section.links.map((link) => (
								<li key={link.id}>
									<Link href={resolveHref(lang, link.linkUrl)}>{link.title}</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				text
			)}
		</section>
	);
}

// The Sitemap page: the centred title, then one area per part of the site, its title linking to it (with the diagonal
// arrow), a sentence about it and its links, ruled between rows.
export default function TemplateSitemapPage({ lang, page }: TemplateSitemapPageProps) {
	return (
		<BaseWrapper wrapperClasses="section-wrapper-small" colClasses="col-12 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
			<div className="template-sitemap-page">
				<WrappedCollection
					classes="center-aligned"
					heading={{ id: 'sitemap-title', title: page.title, titleTag: 'h1' }}
					body={toRows(page.sections).map((row) => (
						<div key={row[0].id} className="row">
							{row.map((section) => (
								<Area key={section.id} lang={lang} section={section} />
							))}
						</div>
					))}
				/>
			</div>
		</BaseWrapper>
	);
}
