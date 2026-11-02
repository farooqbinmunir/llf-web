import type { ReactNode } from 'react';

type ContentBoxBlockInlineProps = {
	title: string;
	titleTag?: 'h2' | 'h3' | 'p';
	// A glyph before the title, as Follow LLF and Stay informed have.
	icon?: 'share' | 'bell';
	// A small image beside the content, as the guidelines download has its mark.
	media?: ReactNode;
	text?: string | null;
	// The surface the box paints, such as `rsg-surface-light-4` for a card on a light section.
	surface?: string;
	// `boxed` draws the box as a card, as the Contact page's are.
	classes?: string;
	// The box's links, or a form.
	children?: ReactNode;
};

// A title and a few lines with their links, beside an optional small image: the Contact page's cards and the Funding
// queries download.
export default function ContentBoxBlockInline({ title, titleTag: TitleTag = 'h2', icon, media, text, surface, classes, children }: ContentBoxBlockInlineProps) {
	const blockClasses = ['content-box-block', 'inline', surface, classes, !media && 'no-media'].filter(Boolean).join(' ');

	return (
		<div className={blockClasses}>
			{media && <div className="rsg-media-wrapper">{media}</div>}

			<div className="rsg-content-wrapper">
				<TitleTag className={icon ? `rsg-title rsg-fa ${icon}` : 'rsg-title'}>{title}</TitleTag>
				{text && <p className="rsg-text">{text}</p>}
				{children}
			</div>
		</div>
	);
}
