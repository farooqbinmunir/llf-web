import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SinglePage from '@/components/views/single-page';
import { hasLocale } from '@/i18n/config';
import { getPage, getPages } from '@/lib/data/pages';

// Generic pages live at the site's top level (/privacy-policy). The route catches every path no other route matches, so
// an unknown address of any depth reaches `notFound()` and the branded 404 inside the site's layout. As for the detail
// pages (M06), it reads the slug before rendering, so the 404 is a real one.
export const instant = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
	if (!hasLocale(params.lang)) return [];

	return (await getPages(params.lang)).map((page) => ({ slug: [page.slug] }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/[...slug]'>): Promise<Metadata> {
	const { lang, slug } = await params;
	if (!hasLocale(lang) || slug.length !== 1) return {};

	const page = await getPage(lang, slug[0]);
	if (!page) return {};

	return { title: page.seo?.metaTitle ?? page.title, description: page.seo?.metaDescription ?? page.intro ?? undefined };
}

export default async function GenericPage({ params }: PageProps<'/[lang]/[...slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang) || slug.length !== 1) notFound();

	const page = await getPage(lang, slug[0]);
	if (!page) notFound();

	return <SinglePage lang={lang} page={page} />;
}
