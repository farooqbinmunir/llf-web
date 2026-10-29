import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	sassOptions: {
		// Lets every component stylesheet reach the shared abstracts with `@use 'abstracts' as *;`, and abstracts reach Bootstrap and Font Awesome.
		loadPaths: [path.join(process.cwd(), 'src/styles'), path.join(process.cwd(), 'node_modules')],
		// Bootstrap 5 still uses the legacy Sass API; silence its warnings without hiding ours.
		quietDeps: true,
	},
};

export default nextConfig;
