import type { ReactNode } from 'react';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';

type GroupedContentBlockProps = {
	heading?: CollectionHeading;
	items: { key: string; content: ReactNode }[];
	// The column each item takes, such as `col-12 col-md-6`.
	colClasses: string;
	// Presentation, as Radstone's item classes: `center-aligned` (centred header), `split-view` (header beside the
	// items from lg up), `boxed-items` (items as cards), `top-border` / `bottom-border` (a line above or below each item).
	classes?: string;
	links?: ReactNode;
};

// The classes the collection's own layout reads; the rest style the block's items.
const COLLECTION_CLASSES = ['center-aligned', 'split-view'];

// A row of like items (figures, photos, results, cards) under an optional header.
export default function GroupedContentBlockStandard({ heading, items, colClasses, classes, links }: GroupedContentBlockProps) {
	if (items.length === 0) return null;

	const collectionClasses = classes
		?.split(' ')
		.filter((name) => COLLECTION_CLASSES.includes(name))
		.join(' ');

	return (
		<div className={classes ? `grouped-content-block standard ${classes}` : 'grouped-content-block standard'} role={heading?.id ? 'region' : undefined} aria-labelledby={heading?.id}>
			<WrappedCollection
				classes={collectionClasses || undefined}
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
				links={links}
			/>
		</div>
	);
}
