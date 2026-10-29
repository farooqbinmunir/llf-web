'use client';

import { useSyncExternalStore } from 'react';

// Breakpoints come from the `--breakpoint-*` custom properties, so the stylesheet stays their single source.
const query = (name: string) => window.matchMedia(`(min-width: ${getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${name}`).trim()})`);

// True from the named breakpoint up. The server and the first client render assume the smallest screen,
// so components should let CSS handle anything visible before hydration.
export default function useBreakpointUp(name: 'sm' | 'md' | 'lg' | 'xl' | 'xxl') {
	return useSyncExternalStore(
		(onChange) => {
			const mediaQuery = query(name);

			mediaQuery.addEventListener('change', onChange);

			return () => mediaQuery.removeEventListener('change', onChange);
		},
		() => query(name).matches,
		() => false,
	);
}
