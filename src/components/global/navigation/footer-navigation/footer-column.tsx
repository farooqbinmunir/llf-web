'use client';

import { useId, useState, type ReactNode } from 'react';
import useBreakpointUp from '@/hooks/useBreakpointUp';

type FooterColumnProps = { heading: string; children: ReactNode };

// An accordion below the lg breakpoint and a plain heading above it. The CSS decides whether the links show,
// so they are visible on desktop before hydration; the script only swaps the button for a heading there.
export default function FooterColumn({ heading, children }: FooterColumnProps) {
	const listId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useBreakpointUp('lg');

	return (
		<div className={`rsg-footer-column${isOpen ? ' is-open' : ''}`}>
			<h2 className="rsg-footer-column-title">
				{isDesktop ? (
					heading
				) : (
					<button className="rsg-footer-column-toggle" type="button" aria-expanded={isOpen} aria-controls={listId} onClick={() => setIsOpen(!isOpen)}>
						{heading}
					</button>
				)}
			</h2>

			<ul id={listId} className="rsg-footer-column-links" role="list">
				{children}
			</ul>
		</div>
	);
}
