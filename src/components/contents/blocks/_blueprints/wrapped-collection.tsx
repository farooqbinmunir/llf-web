import type { ReactNode } from 'react';
import TextWithBreaks from '@/components/helpers/text-with-breaks';

export type CollectionHeading = {
	// Names the block's region; set on the title, or on the label when the label is the block's only heading.
	id?: string;
	label?: string | null;
	title?: string | null;
	text?: string | null;
	// The title is the page's heading when the block opens the page in place of a page header.
	titleTag?: 'h1' | 'h2';
	// A photo beside the header and the collection (from lg up), as the About intro has.
	media?: ReactNode;
};

type WrappedCollectionProps = { heading?: CollectionHeading; body: ReactNode; links?: ReactNode; classes?: string };

// The shared shape of a collection block: an optional header (label, title, text), the collection itself, then links.
// A label with no title is the block's heading, so it is the heading element. `split-view` sets the header beside the
// collection from lg up.
export default function WrappedCollection({ heading, body, links, classes }: WrappedCollectionProps) {
	const hasHeader = Boolean(heading?.label || heading?.title || heading?.text);
	const LabelTag = heading?.title ? 'p' : 'h2';
	const TitleTag = heading?.titleTag ?? 'h2';
	const wrapperClasses = ['rsg-wrapped-collection', heading?.media && 'has-media', classes].filter(Boolean).join(' ');

	return (
		<div className={wrapperClasses}>
			<div className="rsg-row-collection">
				{heading && hasHeader && (
					<div className="rsg-col-header">
						{heading.label && (
							<LabelTag id={heading.title ? undefined : heading.id} className="rsg-label">
								{heading.label}
							</LabelTag>
						)}
						{heading.title && (
							<TitleTag id={heading.id} className="rsg-title">
								<TextWithBreaks text={heading.title} />
							</TitleTag>
						)}
						{heading.text && <p className="rsg-text">{heading.text}</p>}
					</div>
				)}

				<div className="rsg-col-content">{body}</div>

				{heading?.media && <div className="rsg-col-media">{heading.media}</div>}
			</div>

			{links && <div className="rsg-link-list rsg-main-links">{links}</div>}
		</div>
	);
}
