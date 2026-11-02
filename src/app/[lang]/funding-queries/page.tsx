import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TemplateFundingPage from '@/components/views/template-funding-page';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getFundingPage } from '@/lib/data/contact';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: PageProps<'/[lang]/funding-queries'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getFundingPage(lang);

	return pageMetadata(lang, { path: '/funding-queries', seo: page?.seo, title: page?.title });
}

export default async function FundingQueriesPage({ params }: PageProps<'/[lang]/funding-queries'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getFundingPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	return <TemplateFundingPage lang={lang} page={page} labels={dictionary.contact} />;
}
