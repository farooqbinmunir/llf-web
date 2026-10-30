import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import StatisticBlockStandard from '@/components/contents/blocks/statistic-block/statistic-block-standard';
import TestimonialBlockStandard from '@/components/contents/blocks/testimonial-block/testimonial-block-standard';
import TextBoxBlockStandard from '@/components/contents/blocks/text-box-block/text-box-block-standard';
import type { Locale } from '@/i18n/config';
import type { BodySection } from '@/lib/strapi/types';

type ContentBlocksProps = { lang: Locale; sections: BodySection[] };

// Photos and figures run the width of the page's header column; text and quotes sit in a narrower measure inside it.
const MEDIA_COLUMN = 'col-12 col-lg-8 offset-lg-2';
const TEXT_COLUMN = 'col-12 col-lg-6 offset-lg-3';
const MEDIA_SIZES = '(min-width: 992px) 66vw, 100vw';

// A page's body: the editor's sequence of Strapi blocks, each rendered as its Radstone block in a section of its own.
export default function ContentBlocks({ lang, sections }: ContentBlocksProps) {
	return sections.map((section, index) => {
		const key = `${section.__component}-${section.id}`;

		switch (section.__component) {
			case 'shared.text-section':
				return (
					<BaseWrapper key={key} colClasses={TEXT_COLUMN}>
						{/* Text sections that follow one another are divided by a line. */}
						<TextBoxBlockStandard lang={lang} title={section.heading} text={section.body} classes={sections[index - 1]?.__component === 'shared.text-section' ? 'top-border' : undefined} />
					</BaseWrapper>
				);

			case 'shared.media':
				return (
					section.file && (
						<BaseWrapper key={key} colClasses={MEDIA_COLUMN}>
							<MediaBlockStandard image={section.file} caption={section.caption} aspectRatio="3x2" sizes={MEDIA_SIZES} />
						</BaseWrapper>
					)
				);

			case 'shared.media-row':
				return (
					<BaseWrapper key={key} colClasses={MEDIA_COLUMN}>
						<GroupedContentBlockStandard
							colClasses={`col-12 col-md-${12 / Math.max(section.items.length, 1)}`}
							items={section.items.flatMap((item) =>
								item.file ? [{ key: String(item.id), content: <MediaBlockStandard image={item.file} caption={item.caption} aspectRatio="1x1" sizes="(min-width: 768px) 33vw, 100vw" /> }] : [],
							)}
						/>
					</BaseWrapper>
				);

			case 'shared.testimonial':
				return (
					<BaseWrapper key={key} colClasses={TEXT_COLUMN}>
						<TestimonialBlockStandard testimonials={[section]} />
					</BaseWrapper>
				);

			case 'shared.stat-row':
				return (
					<BaseWrapper key={key} colClasses={MEDIA_COLUMN}>
						<GroupedContentBlockStandard
							classes="top-border bottom-border"
							colClasses="col-12 col-md-6"
							items={section.items.map((stat) => ({ key: stat.value, content: <StatisticBlockStandard statistic={stat.value} footnote={stat.description} /> }))}
						/>
					</BaseWrapper>
				);

			case 'shared.highlight':
				return (
					<BaseWrapper key={key} wrapperClasses="section-wrapper-small section-rounded-top" brand="yellow" colClasses={TEXT_COLUMN}>
						<TextBoxBlockStandard lang={lang} title={section.heading} text={section.body} />
						{section.quote && <TestimonialBlockStandard testimonials={[section.quote]} classes="lined" />}
					</BaseWrapper>
				);
		}
	});
}
