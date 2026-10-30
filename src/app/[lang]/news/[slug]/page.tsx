import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withoutBreaks } from '@/components/helpers/text-with-breaks';
import SingleNews from '@/components/views/single-news';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getNewsItem, getNewsSlugs, getRelatedNews } from '@/lib/data/news';

const RELATED_LIMIT = 3;

// As for projects (M06): the page reads the slug before rendering, so an unknown slug answers a real 404, and seeded
// slugs are prerendered anyway.
export const instant = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
	if (!hasLocale(params.lang)) return [];

	return (await getNewsSlugs(params.lang)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/news/[slug]'>): Promise<Metadata> {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) return {};

	const news = await getNewsItem(lang, slug);
	if (!news) return {};

	return { title: news.seo?.metaTitle ?? withoutBreaks(news.title), description: news.seo?.metaDescription ?? news.excerpt ?? undefined };
}

export default async function NewsItemPage({ params }: PageProps<'/[lang]/news/[slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();

	const [news, dictionary] = await Promise.all([getNewsItem(lang, slug), getDictionary(lang)]);
	if (!news) notFound();

	const related = await getRelatedNews(lang, news, RELATED_LIMIT);

	return <SingleNews lang={lang} news={news} related={related} dictionary={dictionary} />;
}
