import type { NextConfig } from 'next';
import path from 'node:path';

if (!process.env.STRAPI_URL) throw new Error('STRAPI_URL is not set. Copy .env.example to .env.local.');

const strapiUrl = new URL(process.env.STRAPI_URL);

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	images: {
		remotePatterns: [new URL('/uploads/**', strapiUrl)],
		// Next blocks optimising images from private IPs to prevent SSRF. Only a locally running CMS needs the exception.
		dangerouslyAllowLocalIP: strapiUrl.hostname === 'localhost',
	},
	sassOptions: {
		// Lets every component stylesheet reach the shared abstracts with `@use 'abstracts' as *;`, and abstracts reach Bootstrap and Font Awesome.
		loadPaths: [path.join(process.cwd(), 'src/styles'), path.join(process.cwd(), 'node_modules')],
		// Bootstrap 5 still uses the legacy Sass API; silence its warnings without hiding ours.
		quietDeps: true,
	},
};

export default nextConfig;
