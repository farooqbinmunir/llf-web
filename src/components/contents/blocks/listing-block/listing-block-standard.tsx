import type { ReactNode } from 'react';
import Link from 'next/link';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';

type Tile = { key: string; tile: ReactNode };

type ListingBlockStandardProps = {
	// The label, or the title when there is no label, names the block's region.
	heading?: CollectionHeading & { id: string };
	viewAll?: { label: string; href: string };
	// Presentation, as Radstone's item classes: `center-aligned` (centred header, and a short row centred).
	classes?: string;
	// The tile's column, such as `col-12 col-md-6`; one tile per row by default.
	colClasses?: string;
	tiles?: Tile[];
	// In place of `tiles`: the tiles grouped under titles, as Radstone's listing groups them by a term.
	groups?: { key: string; title?: string | null; tiles: Tile[] }[];
};

// A list of tiles ("More news", a governance body's people), optionally under group titles, with a link to the full
// listing below it.
export default function ListingBlockStandard({ heading, viewAll, classes, colClasses = 'col-12', tiles = [], groups }: ListingBlockStandardProps) {
	const tileRow = (rowTiles: Tile[]) => (
		<div className="row" role="list">
			{rowTiles.map(({ key, tile }) => (
				<div key={key} className={`col ${colClasses}`} role="listitem">
					{tile}
				</div>
			))}
		</div>
	);

	return (
		<div className="listing-block standard" role={heading ? 'region' : undefined} aria-labelledby={heading?.id}>
			<WrappedCollection
				heading={heading}
				classes={classes}
				body={
					groups ? (
						<div className="rsg-listing-groups">
							{groups.map((group) => (
								<div key={group.key} className="rsg-listing-group">
									{group.title && <h2 className="rsg-group-title">{group.title}</h2>}
									{tileRow(group.tiles)}
								</div>
							))}
						</div>
					) : (
						tileRow(tiles)
					)
				}
				links={
					viewAll && (
						<Link className="rsg-button" href={viewAll.href}>
							{viewAll.label}
						</Link>
					)
				}
			/>
		</div>
	);
}
