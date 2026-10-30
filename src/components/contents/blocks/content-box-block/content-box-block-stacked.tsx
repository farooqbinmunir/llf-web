import type { Palette } from '@/components/contents/blocks/base-wrapper';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Media } from '@/lib/strapi/types';

type ContentBoxBlockStackedProps = {
	icon: Media | null;
	title: string;
	text: string | null;
	// The card takes tone 4 (card) of the palette of the section it sits in.
	palette: Palette;
	// `center-aligned` centres the card's content from md up, as the Our model cards are.
	classes?: string;
};

// A card with a small icon, a title and a sentence: the icon sits beside the text on mobile and above it from md up.
// The icon is decorative, since the title names the card.
export default function ContentBoxBlockStacked({ icon, title, text, palette, classes }: ContentBoxBlockStackedProps) {
	const blockClasses = ['content-box-block', 'stacked', `rsg-surface-${palette}-4`, classes, !icon && 'no-media'].filter(Boolean).join(' ');

	return (
		<div className={blockClasses}>
			{icon && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={icon} aspectRatio="orig" sizes="80px" alt="" />
				</div>
			)}

			<div className="rsg-content-wrapper">
				<h3 className="rsg-title">{title}</h3>
				{text && <p className="rsg-text">{text}</p>}
			</div>
		</div>
	);
}
