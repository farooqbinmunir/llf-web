import type { NextConfig } from 'next';
import path from 'node:path';

if (!process.env.STRAPI_URL) throw new Error('STRAPI_URL is not set. Copy .env.example to .env.local.');
if (!process.env.SITE_URL) throw new Error('SITE_URL is not set. Copy .env.example to .env.local.');

const strapiUrl = new URL(process.env.STRAPI_URL);

// In production the CMS stores media in Azure Blob Storage, so its upload URLs point at the storage account, not the CMS.
const mediaPatterns = process.env.STRAPI_MEDIA_URL ? [new URL('/**', process.env.STRAPI_MEDIA_URL)] : [];

const nextConfig: NextConfig = {
	// A self-contained server folder, deployed to Azure App Service without the full node_modules.
	output: 'standalone',
	cacheComponents: true,
	partialPrefetching: true,
	experimental: {
		// The stylesheet is about 22kB, so it goes into the HTML rather than blocking the first paint with a request.
		inlineCss: true,
	},
	images: {
		remotePatterns: [new URL('/uploads/**', strapiUrl), ...mediaPatterns],
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
