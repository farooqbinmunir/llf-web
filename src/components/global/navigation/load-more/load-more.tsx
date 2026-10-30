import Link from 'next/link';

type LoadMoreProps = { nextHref?: string; label: string; filters?: { id: string; label: string } };

// "Load more" links to the same listing with one more page of results, so it works before hydration; beside it, a jump
// back up to the filters.
export default function LoadMore({ nextHref, label, filters }: LoadMoreProps) {
	if (!nextHref && !filters) return null;

	return (
		<div className="rsg-load-more">
			{nextHref && (
				<Link className="rsg-load-more-button" href={nextHref} scroll={false}>
					{label}
				</Link>
			)}

			{filters && (
				<a className="rsg-filters-jump rsg-fa" href={`#${filters.id}`}>
					{filters.label}
				</a>
			)}
		</div>
	);
}
