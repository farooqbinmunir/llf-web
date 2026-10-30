'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';
import Splide from '@splidejs/splide';
import type { Dictionary } from '@/i18n/dictionaries';

// `footer` sits beside the dots, for a "View all" link.
type CarouselProps = { label: string; labels: Dictionary['carousel']; className?: string; footer?: ReactNode; children: ReactNode };

// Reads a duration token such as `750ms` or `0.5s` in milliseconds.
const toMilliseconds = (value: string) => (value.trim().endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000);

// A Splide carousel of whatever slides it is given, paged by dots. Splide supplies the carousel semantics (region, slide
// groups, labelled pagination tabs with arrow-key support), in the page's language through `labels`. Slide widths, the gap
// and the speed come from CSS (core/_splide.scss), so the stylesheet alone sets how many slides show at each width.
export default function Carousel({ label, labels, className, footer, children }: CarouselProps) {
	const root = useRef<HTMLElement>(null);

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
		<section ref={root} className={className ? `carousel splide ${className}` : 'carousel splide'} aria-label={label}>
			<div className="splide__track">
				<ul className="splide__list">
					{Children.map(children, (child) => (
						<li className="splide__slide">{child}</li>
					))}
				</ul>
			</div>

			{/* Splide fills the existing pagination list, so the dots share a row with the footer. */}
			<div className="controls">
				<ul className="splide__pagination" />
				{footer}
			</div>
		</section>
	);
}
