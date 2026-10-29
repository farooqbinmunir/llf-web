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
		<div className="rsg-site-footer__column" data-open={isOpen || undefined}>
			<h2 className="rsg-site-footer__heading">
				{isDesktop ? (
					heading
				) : (
					<button className="rsg-site-footer__toggle" type="button" aria-expanded={isOpen} aria-controls={listId} onClick={() => setIsOpen(!isOpen)}>
						{heading}
					</button>
				)}
			</h2>

			<ul id={listId} className="rsg-site-footer__list" role="list">
				{children}
			</ul>
		</div>
	);
}
