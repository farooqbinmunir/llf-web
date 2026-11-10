import { collectionHeading } from '@/components/contents/blocks/_blueprints/block-heading';
import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import StatisticBlockStandard from '@/components/contents/blocks/statistic-block/statistic-block-standard';
import type { StatisticBlock as StatisticBlockData } from '@/lib/data/blocks';

type StatisticBlockProps = { block: StatisticBlockData; id: string; isPageHeading?: boolean };

// A statistic block from the CMS: its figures under the heading. With a photo in the heading, the figures sit small
// under the intro beside the photo cut to the shield (About, Who we are); without one, they are centred cards.
export default function StatisticBlock({ block, id, isPageHeading }: StatisticBlockProps) {
	const { heading, stats } = block;
	const media = heading.media && <MediaBlockStandard image={heading.media} aspectRatio="9x10" sizes="(min-width: 992px) 480px, 90vw" alt="" preload={isPageHeading} />;

	return (
		<BaseWrapper {...settingsWrapperProps(block.settings)}>
			<GroupedContentBlockStandard
				heading={{ ...collectionHeading(heading, id, isPageHeading), media }}
				classes={media ? 'shield-media' : 'center-aligned boxed-items'}
				colClasses={media ? 'col-4 col-sm-3' : 'col-6 col-lg-3'}
				items={stats.map((stat, index) => ({
					key: String(index),
					content: <StatisticBlockStandard statistic={stat.value} prefix={stat.label} footnote={stat.description} />,
				}))}
			/>
		</BaseWrapper>
	);
}
