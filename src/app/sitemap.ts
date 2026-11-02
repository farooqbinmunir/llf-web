import type { MetadataRoute } from 'next';
import { absoluteUrl, locales } from '@/i18n/config';
import { getIndexedEntries } from '@/lib/data/sitemap';
import { languageAlternates, translatedPaths } from '@/lib/metadata';

// The pages with fixed addresses. Search results and the enquiry form are left out: they are reached from other pages and
// say nothing a search engine should list.
const STATIC_PATHS = ['/', '/about-us', '/our-projects', '/field-updates', '/library', '/news', '/contact', '/funding-queries', '/partnerships', '/sitemap'];

// Every page in every language, each listing its translations so search engines can pair them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const sharedPaths = (path: string) => languageAlternates(Object.fromEntries(locales.map((locale) => [locale, path])));

	const staticPages = locales.flatMap((lang) => STATIC_PATHS.map((path) => ({ url: absoluteUrl(lang, path), alternates: { languages: sharedPaths(path) } })));

	const entries = await Promise.all(
		locales.map(async (lang) =>
			(await getIndexedEntries(lang)).map((entry) => ({
				url: absoluteUrl(lang, `${entry.base}/${entry.slug}`),
				lastModified: entry.updatedAt,
				alternates: { languages: languageAlternates(translatedPaths(lang, entry.base, entry)) },
			})),
		),
	);

	return [...staticPages, ...entries.flat()];
}
