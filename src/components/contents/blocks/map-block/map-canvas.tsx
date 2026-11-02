'use client';

import { useRef, type CSSProperties } from 'react';
import useInView from '@/hooks/useInView';

// A pin's place on the map, as percentages of its width and height.
export type MapPin = { key: string; x: number; y: number };

// The map and its pins. The pins drop in one after another the first time the map scrolls into view. It is decorative:
// the countries it marks are listed on the About page.
export default function MapCanvas({ pins }: { pins: MapPin[] }) {
	const root = useRef<HTMLDivElement>(null);
	const state = useInView(root);

	return (
		<div ref={root} className={state === 'static' ? 'map' : `map is-${state}`} aria-hidden="true">
			<div className="canvas">
				<span className="world" />

				<ul className="pins">
					{pins.map((pin, index) => (
						<li key={pin.key} className="pin" style={{ '--pin-x': `${pin.x}%`, '--pin-y': `${pin.y}%`, '--pin-index': index } as CSSProperties} />
					))}
				</ul>
			</div>
		</div>
	);
}
