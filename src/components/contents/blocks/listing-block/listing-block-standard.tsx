import type { ReactNode } from 'react';
import Link from 'next/link';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';

type ListingBlockStandardProps = {
	// The label, or the title when there is no label, names the block's region.
	heading: CollectionHeading & { id: string };
	viewAll: { label: string; href: string };
	// Presentation, as Radstone's item classes: `center-aligned` (centred header).
	classes?: string;
	// The tile's column, such as `col-12 col-md-6`; one tile per row by default.
	colClasses?: string;
	tiles: { key: string; tile: ReactNode }[];
};

// A labelled list of tiles ("More news") with a link to the full listing below it.
export default function ListingBlockStandard({ heading, viewAll, classes, colClasses = 'col-12', tiles }: ListingBlockStandardProps) {
	return (
		<div className="listing-block standard" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				heading={heading}
				classes={classes}
				body={
					<div className="row" role="list">
						{tiles.map(({ key, tile }) => (
							<div key={key} className={`col ${colClasses}`} role="listitem">
								{tile}
							</div>
						))}
					</div>
				}
				links={
					<Link className="rsg-button" href={viewAll.href}>
						{viewAll.label}
					</Link>
				}
			/>
		</div>
	);
}
