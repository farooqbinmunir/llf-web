import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Sections from '@/components/contents/blocks/sections';
import { hasLocale } from '@/i18n/config';
import { getAboutPage } from '@/lib/data/about';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: PageProps<'/[lang]/about-us'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getAboutPage(lang);
	// The opening block's intro and photo describe the page when the editors set no SEO.
	const opening = page?.sections[0]?.heading;

	return pageMetadata(lang, { path: '/about-us', seo: page?.seo, title: page?.title, description: opening?.text, image: opening?.media });
}

// The About us page: the sections the editors set in the CMS. It has no hero, so the first block's title is the page's
// heading.
export default async function AboutPage({ params }: PageProps<'/[lang]/about-us'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const page = await getAboutPage(lang);
	if (!page) notFound();

	return page.sections.length > 0 ? <Sections lang={lang} sections={page.sections} opensPage /> : <h1 className="rsg-visually-hidden">{page.title}</h1>;
}
