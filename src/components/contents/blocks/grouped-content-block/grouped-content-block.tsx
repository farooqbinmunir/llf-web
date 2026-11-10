import Link from 'next/link';
import { collectionHeading } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockStacked from '@/components/contents/blocks/content-box-block/content-box-block-stacked';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import { resolveHref, type Locale } from '@/i18n/config';
import type { GroupedContentBlock as GroupedContentBlockData } from '@/lib/data/blocks';

type GroupedContentBlockProps = { lang: Locale; block: GroupedContentBlockData; id: string; isPageHeading?: boolean };

// A grouped content block from the CMS, as About's Our model and Partner with us: centred icon cards, four across from
// lg up, with the heading's buttons below them.
export default function GroupedContentBlock({ lang, block, id, isPageHeading }: GroupedContentBlockProps) {
	const { heading, items, settings } = block;
	const palette = settings?.brand === 'dark' ? 'dark' : 'light';

	return (
		<BaseWrapper {...settingsWrapperProps(settings)}>
			<GroupedContentBlockStandard
				heading={collectionHeading(heading, id, isPageHeading)}
				classes="center-aligned boxed-items"
				colClasses="col-12 col-md-6 col-lg-3"
				items={items.map((item) => ({
					key: String(item.id),
					content: <ContentBoxBlockStacked icon={item.icon} title={item.title} text={item.text} palette={palette} classes="center-aligned" />,
				}))}
				links={
					heading.links.length > 0 &&
					heading.links.map((link) => (
						<Link key={link.id} className="rsg-button" href={resolveHref(lang, link.url)}>
							{link.label}
						</Link>
					))
				}
			/>
		</BaseWrapper>
	);
}
