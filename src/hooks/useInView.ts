'use client';

import { useEffect, useState, type RefObject } from 'react';

// `static` before hydration and for visitors who prefer reduced motion, `waiting` until the element first scrolls into
// view, then `in-view` for good. Entrance animations hide their content only while `waiting`, so it shows without JavaScript.
export type InViewState = 'static' | 'waiting' | 'in-view';

// How much of the element must show before it counts as in view.
const THRESHOLD = 0.25;

export default function useInView(ref: RefObject<Element | null>) {
	const [state, setState] = useState<InViewState>('static');

	useEffect(() => {
		const element = ref.current;
		if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				setState('in-view');
				observer.disconnect();
			},
			{ threshold: THRESHOLD },
		);

		setState('waiting');
		observer.observe(element);

		return () => observer.disconnect();
	}, [ref]);

	return state;
}
