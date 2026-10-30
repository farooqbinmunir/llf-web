'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';
import Splide from '@splidejs/splide';
import type { Dictionary } from '@/i18n/dictionaries';

// `header` sits above the track, inside the carousel's region; `footer` sits beside the dots, for a "View all" link.
type CarouselProps = { label: string; labels: Dictionary['carousel']; header?: ReactNode; footer?: ReactNode; children: ReactNode };

// Reads a duration token such as `750ms` or `0.5s` in milliseconds.
const toMilliseconds = (value: string) => (value.trim().endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000);

// A Splide carousel of whatever slides it is given, paged by dots. Splide supplies the carousel semantics (region, slide
// groups, labelled pagination tabs with arrow-key support), in the page's language through `labels`. Slide widths, the gap
// and the speed come from CSS (core/_splide.scss), so the stylesheet alone sets how many slides show at each width.
export default function Carousel({ label, labels, header, footer, children }: CarouselProps) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!root.current) return;

		const styles = getComputedStyle(root.current);
		const splide = new Splide(root.current, {
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

		return () => {
			splide.destroy(true);
		};
	}, [label, labels]);

	return (
		<div ref={root} className="splide" aria-label={label}>
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
