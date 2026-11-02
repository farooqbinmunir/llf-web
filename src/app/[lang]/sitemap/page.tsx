import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TemplateSitemapPage from '@/components/views/template-sitemap-page';
import { hasLocale } from '@/i18n/config';
import { getSitemapPage } from '@/lib/data/pages';

export async function generateMetadata({ params }: PageProps<'/[lang]/sitemap'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getSitemapPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription };
}

export default async function SitemapPage({ params }: PageProps<'/[lang]/sitemap'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const page = await getSitemapPage(lang);
	if (!page) notFound();

	return <TemplateSitemapPage lang={lang} page={page} />;
}
