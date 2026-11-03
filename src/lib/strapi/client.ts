import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';

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

// Every Strapi read goes through here. The CMS's revalidation webhook expires the `strapi` tag or a type's own tag when
// content changes (see app/api/revalidate), and entries also refresh every few minutes in case a webhook is missed.
// In draft mode (an editor's preview) the cache is skipped and drafts are read with the preview token, as Strapi serves
// drafts only to API tokens.
export async function strapiGet<T>(path: string, query: { [key: string]: QueryValue }, tags: string[]): Promise<T> {
	'use cache';
	cacheLife('minutes');
	cacheTag('strapi', ...tags);

	if (!STRAPI_URL) throw new Error('STRAPI_URL is not set. Copy .env.example to .env.local.');

	const { isEnabled: preview } = await draftMode();
	const token = process.env.STRAPI_PREVIEW_TOKEN;
	if (preview && !token) throw new Error('STRAPI_PREVIEW_TOKEN is not set. Run `npm run token:preview` in llf.');

	const params = new URLSearchParams();
	appendQuery(params, preview ? { ...query, status: 'draft' } : query, '');

	const response = await fetch(`${STRAPI_URL}/api${path}?${params}`, preview ? { headers: { Authorization: `Bearer ${token}` } } : undefined);

	if (!response.ok) throw new Error(`Strapi request for ${path} failed with ${response.status}: ${await response.text()}`);

	return response.json();
}

// Stores a form submission. The forms token may only create enquiries and newsletter sign-ups, so it never leaves the
// server. Strapi's answer is returned as it is, for the caller to tell a rejected value from an outage.
export async function strapiCreate(path: string, data: Record<string, string>) {
	const token = process.env.STRAPI_FORMS_TOKEN;
	if (!STRAPI_URL || !token) throw new Error('STRAPI_URL or STRAPI_FORMS_TOKEN is not set. See .env.example.');

	return fetch(`${STRAPI_URL}/api${path}`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ data }),
	});
}

// Strapi returns upload URLs relative to the CMS when files are stored locally.
export const strapiMediaUrl = (url: string) => (url.startsWith('http') ? url : `${STRAPI_URL}${url}`);
