import type { Metadata } from 'next';
import { absoluteUrl, defaultLocale, hasLocale, localisedPath, locales, type Locale } from '@/i18n/config';
import { getGlobal, type Global } from '@/lib/data/global';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { Media, Seo, Translation } from '@/lib/strapi/types';

// Open Graph names a locale with its region.
const OG_LOCALES: Record<Locale, string> = { en: 'en_GB', fr: 'fr_FR', ar: 'ar_AR' };

type PageMetadata = {
	// The page's address without a language ("/our-projects").
	path: string;
	title?: string | null;
	description?: string | null;
	// The page's own photo, shared when the editors have not chosen a share image.
	image?: Media | null;
	seo?: Seo | null;
	// The page's address in each language, for pages whose slug is per locale. Without it, every language shares the path.
	paths?: Partial<Record<Locale, string>>;
	// A dated article (story or news) rather than a page.
	publishedTime?: string | null;
};

// The addresses of a detail page in its own language and in each language it has been translated into.
export function translatedPaths(lang: Locale, base: string, entry: { slug: string; localizations: Translation[] }) {
	const paths: Partial<Record<Locale, string>> = { [lang]: `${base}/${entry.slug}` };

	entry.localizations.forEach(({ locale, slug }) => {
		if (hasLocale(locale)) paths[locale] = `${base}/${slug}`;
	});

	return paths;
}

// Each language's full address, keyed by language. Search engines use these as hreflang alternates.
export function languageAlternates(paths: Partial<Record<Locale, string>>) {
	return Object.fromEntries(locales.flatMap((locale) => (paths[locale] === undefined ? [] : [[locale, absoluteUrl(locale, paths[locale])]])));
}

// Every route's metadata: title and description (the editors' SEO fields first, then the page's own copy, then the site's),
// the canonical address, the alternates in the other languages, and the Open Graph card for social shares.
export async function pageMetadata(lang: Locale, { path, title, description, image, seo, paths, publishedTime }: PageMetadata): Promise<Metadata> {
	const site = await getGlobal(lang);
	const languages = languageAlternates(paths ?? Object.fromEntries(locales.map((locale) => [locale, path])));
	const shareTitle = seo?.metaTitle ?? title ?? site?.siteName;
	const shareDescription = seo?.metaDescription ?? description ?? site?.siteDescription;
	const shareImage = seo?.shareImage ?? image ?? site?.shareImage;
	const url = localisedPath(lang, path);
	const pageTitle = seo?.metaTitle ?? title;

	return {
		// Left out rather than undefined when there is none, since an undefined title also hides the layout's default.
		...(pageTitle && { title: pageTitle }),
		description: shareDescription,
		alternates: { canonical: url, languages: { ...languages, ...(languages[defaultLocale] && { 'x-default': languages[defaultLocale] }) } },
		openGraph: {
			...(publishedTime ? { type: 'article', publishedTime } : { type: 'website' }),
			url,
			siteName: site?.siteName,
			locale: OG_LOCALES[lang],
			alternateLocale: locales.filter((locale) => locale !== lang && locale in languages).map((locale) => OG_LOCALES[locale]),
			title: shareTitle,
			description: shareDescription,
			images: shareImage ? [{ url: strapiMediaUrl(shareImage.url), width: shareImage.width, height: shareImage.height, alt: shareImage.alternativeText ?? undefined }] : undefined,
		},
		twitter: { card: 'summary_large_image' },
	};
}

// LLF as an organisation, with its social accounts, so search engines can connect the site to them.
export function organisationData(lang: Locale, site: Global) {
	return {
		'@type': 'Organization',
		name: site.siteName,
		description: site.siteDescription,
		url: absoluteUrl(lang, '/'),
		sameAs: site.socialLinks.map(({ url }) => url),
	};
}

type Article = { title: string; description: string | null; image: Media | null; publishDate: string | null };

// A story or news item as an article (`NewsArticle` for news), published by LLF.
export function articleData(lang: Locale, path: string, site: Global | null, { title, description, image, publishDate }: Article, type: 'Article' | 'NewsArticle' = 'Article') {
	return {
		'@type': type,
		headline: title,
		description: description ?? undefined,
		image: image ? strapiMediaUrl(image.url) : undefined,
		datePublished: publishDate ?? undefined,
		inLanguage: lang,
		mainEntityOfPage: absoluteUrl(lang, path),
		publisher: site ? { '@type': 'Organization', name: site.siteName, url: absoluteUrl(lang, '/') } : undefined,
	};
}
