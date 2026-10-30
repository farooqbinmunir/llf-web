import type { ReactNode } from 'react';
import TextWithBreaks from '@/components/helpers/text-with-breaks';

export type CollectionHeading = {
	// Names the block's region; set on the title, or on the label when the label is the block's only heading.
	id?: string;
	label?: string | null;
	title?: string | null;
	text?: string | null;
};

type WrappedCollectionProps = { heading?: CollectionHeading; body: ReactNode; links?: ReactNode; classes?: string };

// The shared shape of a collection block: an optional header (label, title, text), the collection itself, then links.
// A label with no title is the block's heading, so it is the heading element.
export default function WrappedCollection({ heading, body, links, classes }: WrappedCollectionProps) {
	const hasHeader = Boolean(heading?.label || heading?.title || heading?.text);
	const LabelTag = heading?.title ? 'p' : 'h2';

	return (
		<div className={classes ? `rsg-wrapped-collection ${classes}` : 'rsg-wrapped-collection'}>
			<div className="rsg-row-collection">
				{heading && hasHeader && (
					<div className="rsg-col-header">
						{heading.label && (
							<LabelTag id={heading.title ? undefined : heading.id} className="rsg-label">
								{heading.label}
							</LabelTag>
						)}
						{heading.title && (
							<h2 id={heading.id} className="rsg-title">
								<TextWithBreaks text={heading.title} />
							</h2>
						)}
						{heading.text && <p className="rsg-text">{heading.text}</p>}
					</div>
				)}

				<div className="rsg-col-content">{body}</div>
			</div>

			{links && <div className="rsg-link-list rsg-main-links">{links}</div>}
		</div>
	);
}
