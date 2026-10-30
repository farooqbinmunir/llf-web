'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';
import Splide from '@splidejs/splide';
import { breakpointQuery, type BreakpointName } from '@/hooks/useBreakpointUp';
import type { Dictionary } from '@/i18n/dictionaries';

// `header` sits above the track, inside the carousel's region; `footer` sits beside the dots, for a "View all" link.
// `gridFrom` lays the slides out as a grid from that breakpoint up, with no carousel (see core/_splide.scss).
type CarouselProps = { label: string; labels: Dictionary['carousel']; header?: ReactNode; footer?: ReactNode; gridFrom?: BreakpointName; children: ReactNode };

// Reads a duration token such as `750ms` or `0.5s` in milliseconds.
const toMilliseconds = (value: string) => (value.trim().endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000);

// A Splide carousel of whatever slides it is given, paged by dots. Splide supplies the carousel semantics (region, slide
// groups, labelled pagination tabs with arrow-key support), in the page's language through `labels`. Slide widths, the gap
// and the speed come from CSS (core/_splide.scss), so the stylesheet alone sets how many slides show at each width.
export default function Carousel({ label, labels, header, footer, gridFrom, children }: CarouselProps) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = root.current;
		if (!element) return;

		const styles = getComputedStyle(element);
		const mount = () =>
			new Splide(element, {
				type: 'slide',
				autoWidth: true,
				arrows: false,
				pagination: true,
				keyboard: 'focused',
				omitEnd: true,
				gap: styles.getPropertyValue('--splide-gap'),
				speed: toMilliseconds(styles.getPropertyValue('--splide-speed')),
				easing: styles.getPropertyValue('--splide-ease'),
				direction: document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr',
				// Splide resets the root's aria-label from this option on mount, so the label is passed here as well as in the markup.
				label,
				i18n: labels,
			}).mount();

		if (!gridFrom) {
			const splide = mount();

			return () => splide.destroy(true);
		}

		// Mounted only below the breakpoint, and destroyed when the window grows past it, so the grid never carries Splide's styles.
		const gridQuery = breakpointQuery(gridFrom);
		let splide: Splide | null = null;
		const update = () => {
			if (gridQuery.matches) {
				splide?.destroy(true);
				splide = null;
			} else if (!splide) {
				splide = mount();
			}
		};

		update();
		gridQuery.addEventListener('change', update);

		return () => {
			gridQuery.removeEventListener('change', update);
			splide?.destroy(true);
		};
	}, [label, labels, gridFrom]);

	return (
		<div ref={root} className={gridFrom ? `splide grid-${gridFrom}` : 'splide'} aria-label={label}>
			{header}

			<div className="splide__track">
				<ul className="splide__list">
					{Children.map(children, (child) => (
						<li className="splide__slide">{child}</li>
					))}
				</ul>
			</div>

			{/* Splide fills the existing pagination list, so the dots share a row with the footer. */}
			<div className="rsg-carousel-footer">
				<ul className="splide__pagination" />
				{footer}
			</div>
		</div>
	);
}
