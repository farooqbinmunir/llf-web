import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoryListing from '@/components/story-listing/StoryListing';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getStoriesPage } from '@/lib/data/stories';

export async function generateMetadata({ params }: PageProps<'/[lang]/field-updates'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getStoriesPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function FieldUpdatesPage({ params, searchParams }: PageProps<'/[lang]/field-updates'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getStoriesPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	return <StoryListing lang={lang} searchParams={searchParams} labels={dictionary.stories} intro={page.hero} title={page.title} />;
}
