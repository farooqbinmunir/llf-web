'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

type LoadMoreProps = { nextHref?: string; label: string; filters?: { id: string; label: string } };

// Once the next page renders, focus moves to the first new result, so keyboard and screen reader users carry on from
// there; the last page has no Load more link, and focus would otherwise fall back to the page. The results are found as
// the `rsg-js-load-more-results` list beside this block, and are watched because the link may be gone when they arrive.
function focusNewResults(event: MouseEvent<HTMLAnchorElement>) {
	const scope = event.currentTarget.closest('.rsg-load-more')?.parentElement;
	const count = scope?.querySelector('.rsg-js-load-more-results')?.children.length;
	if (!scope || count === undefined) return;

	const observer = new MutationObserver(() => {
		const first = scope.querySelector('.rsg-js-load-more-results')?.children[count];
		if (!first) return;
		observer.disconnect();
		first.querySelector<HTMLElement>('a, button')?.focus();
	});
	observer.observe(scope, { childList: true, subtree: true });
	setTimeout(() => observer.disconnect(), 10000);
}

// "Load more" links to the same listing with one more page of results, so it works before hydration; beside it, a jump
// back up to the filters.
export default function LoadMore({ nextHref, label, filters }: LoadMoreProps) {
	if (!nextHref && !filters) return null;

	return (
		<div className="rsg-load-more">
			{nextHref && (
				<Link className="rsg-load-more-button" href={nextHref} scroll={false} onClick={focusNewResults}>
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
