import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withoutBreaks } from '@/components/helpers/text-with-breaks';
import TemplatePartnershipsPage from '@/components/views/template-partnerships-page';
import { hasLocale } from '@/i18n/config';
import { getPartnershipsPage } from '@/lib/data/contact';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: PageProps<'/[lang]/partnerships'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getPartnershipsPage(lang);

	return pageMetadata(lang, { path: '/partnerships', seo: page?.seo, title: page && withoutBreaks(page.title), description: page?.lead });
}

export default async function PartnershipsPage({ params }: PageProps<'/[lang]/partnerships'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const page = await getPartnershipsPage(lang);
	if (!page) notFound();

	return <TemplatePartnershipsPage lang={lang} page={page} />;
}
