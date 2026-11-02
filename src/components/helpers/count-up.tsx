'use client';

import { useEffect, useRef, useState } from 'react';
import useInView from '@/hooks/useInView';
import { toMilliseconds } from '@/lib/css';

// A figure's number and what surrounds it: "USD 1.4B" is "USD ", 1.4 and "B"; "1,200+" keeps its thousands separator.
const FIGURE = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

const easeOut = (progress: number) => 1 - (1 - progress) ** 3;

// Counts a headline figure up from zero when it first scrolls into view, as the home page's impact figures do. The
// figure is complete in the server markup and for visitors who prefer reduced motion, and screen readers only hear it once.
export default function CountUp({ value }: { value: string }) {
	const root = useRef<HTMLSpanElement>(null);
	const state = useInView(root);
	const [progress, setProgress] = useState(1);
	const match = FIGURE.exec(value);

	useEffect(() => {
		const element = root.current;
		if (state !== 'in-view' || !element) return;

		const duration = toMilliseconds(getComputedStyle(element).getPropertyValue('--count-up-duration'));
		const start = performance.now();
		let frame = 0;
		const tick = (now: number) => {
			const elapsed = Math.min(1, (now - start) / duration);

			setProgress(easeOut(elapsed));
			if (elapsed < 1) frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(frame);
	}, [state]);

	if (!match) return value;

	const [, before, number, after] = match;
	const decimals = number.split('.')[1]?.length ?? 0;
	const target = Number.parseFloat(number.replace(/,/g, ''));
	const current = target * (state === 'waiting' ? 0 : progress);
	const shown = number.includes(',') ? current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : current.toFixed(decimals);

	return (
		<span ref={root}>
			<span aria-hidden="true">{`${before}${shown}${after}`}</span>
			<span className="rsg-visually-hidden">{value}</span>
		</span>
	);
}
