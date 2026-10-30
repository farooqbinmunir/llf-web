'use client';

import { useSyncExternalStore } from 'react';

export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Breakpoints come from the `--breakpoint-*` custom properties, so the stylesheet stays their single source.
export const breakpointQuery = (name: BreakpointName) => window.matchMedia(`(min-width: ${getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${name}`).trim()})`);

// True from the named breakpoint up. The server and the first client render assume the smallest screen,
// so components should let CSS handle anything visible before hydration.
export default function useBreakpointUp(name: BreakpointName) {
	return useSyncExternalStore(
		(onChange) => {
			const mediaQuery = breakpointQuery(name);

			mediaQuery.addEventListener('change', onChange);

			return () => mediaQuery.removeEventListener('change', onChange);
		},
		() => breakpointQuery(name).matches,
		() => false,
	);
}
