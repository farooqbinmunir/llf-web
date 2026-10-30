import type { ReactNode } from 'react';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';

type GroupedContentBlockProps = {
	heading?: CollectionHeading;
	items: { key: string; content: ReactNode }[];
	// The column each item takes, such as `col-12 col-md-6`.
	colClasses: string;
	// Presentation, as Radstone's item classes: `center-aligned` (centred header), `boxed-items` (items as cards),
	// `top-border` / `bottom-border` (a line above or below each item).
	classes?: string;
};

// A row of like items (figures, photos, results) under an optional header.
export default function GroupedContentBlockStandard({ heading, items, colClasses, classes }: GroupedContentBlockProps) {
	if (items.length === 0) return null;

	return (
		<div className={classes ? `grouped-content-block standard ${classes}` : 'grouped-content-block standard'} role={heading?.id ? 'region' : undefined} aria-labelledby={heading?.id}>
			<WrappedCollection
				classes={classes?.includes('center-aligned') ? 'center-aligned' : undefined}
				heading={heading}
				body={
					<div className="row" role="list">
						{items.map((item) => (
							<div key={item.key} className={`col ${colClasses}`} role="listitem">
								{item.content}
							</div>
						))}
					</div>
				}
			/>
		</div>
	);
}
