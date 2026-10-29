import { cacheLife, cacheTag } from 'next/cache';

const STRAPI_URL = process.env.STRAPI_URL;

type QueryValue = string | number | boolean | null | undefined | QueryValue[] | { [key: string]: QueryValue };

// Serialises a nested query into Strapi's bracket syntax, e.g. { filters: { slug: { $eq: 'x' } } } becomes filters[slug][$eq]=x.
function appendQuery(params: URLSearchParams, value: QueryValue, key: string) {
	if (value === undefined || value === null) return;

	if (Array.isArray(value)) {
		value.forEach((item, index) => appendQuery(params, item, `${key}[${index}]`));
	} else if (typeof value === 'object') {
		Object.entries(value).forEach(([childKey, child]) => appendQuery(params, child, key ? `${key}[${childKey}]` : childKey));
	} else {
		params.append(key, String(value));
	}
}

// Every Strapi read goes through here. The `strapi` tag plus per-type tags let a CMS webhook revalidate content
// with revalidateTag() once publishing is wired up; until then entries refresh every few minutes.
export async function strapiGet<T>(path: string, query: { [key: string]: QueryValue }, tags: string[]): Promise<T> {
	'use cache';
	cacheLife('minutes');
	cacheTag('strapi', ...tags);

	if (!STRAPI_URL) throw new Error('STRAPI_URL is not set. Copy .env.example to .env.local.');

	const params = new URLSearchParams();
	appendQuery(params, query, '');

	const response = await fetch(`${STRAPI_URL}/api${path}?${params}`);

	if (!response.ok) throw new Error(`Strapi request for ${path} failed with ${response.status}: ${await response.text()}`);

	return response.json();
}

// Strapi returns upload URLs relative to the CMS when files are stored locally.
export const strapiMediaUrl = (url: string) => (url.startsWith('http') ? url : `${STRAPI_URL}${url}`);
