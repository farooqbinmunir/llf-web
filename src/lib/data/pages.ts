import type { Locale } from '@/i18n/config';
import { SEO_QUERY, TRANSLATIONS_QUERY } from '@/lib/data/global';
import { strapiGet } from '@/lib/strapi/client';
import type { BlocksNode, Collection, Seo, Single, Translation } from '@/lib/strapi/types';

// The generic pages at the site's top level (privacy policy, terms of use, accessibility, careers, LLF Hub) and the
// Sitemap page.

export type Page = {
	title: string;
	slug: string;
	intro: string | null;
	body: BlocksNode[] | null;
	seo: Seo | null;
	localizations: Translation[];
};

export type SitemapSection = {
	id: number;
	title: string;
	linkUrl: string | null;
	text: string | null;
	links: { id: number; title: string; linkUrl: string }[];
};

export type SitemapPage = {
	title: string;
	sections: SitemapSection[];
	seo: Seo | null;
};

export async function getPage(lang: Locale, slug: string) {
	const { data } = await strapiGet<Collection<Page>>('/pages', { locale: lang, filters: { slug: { $eq: slug } }, populate: { seo: SEO_QUERY, localizations: TRANSLATIONS_QUERY } }, ['page']);

	return data[0] ?? null;
}

// Every page with its introduction, for the page route's static params and the search's Pages group.
export async function getPages(lang: Locale) {
	const { data } = await strapiGet<Collection<Pick<Page, 'title' | 'slug' | 'intro'>>>(
		'/pages',
		{ locale: lang, fields: ['title', 'slug', 'intro'], sort: ['title:asc'], pagination: { page: 1, pageSize: 100 } },
		['page'],
	);

	return data;
}

export async function getSitemapPage(lang: Locale) {
	const { data } = await strapiGet<Single<SitemapPage>>('/sitemap-page', { locale: lang, populate: { sections: { populate: { links: true } }, seo: SEO_QUERY } }, ['sitemap-page']);

	return data;
}
