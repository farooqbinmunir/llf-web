import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withoutBreaks } from '@/components/helpers/text-with-breaks';
import TemplatePartnershipsPage from '@/components/views/template-partnerships-page';
import { hasLocale } from '@/i18n/config';
import { getPartnershipsPage } from '@/lib/data/contact';

export async function generateMetadata({ params }: PageProps<'/[lang]/partnerships'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getPartnershipsPage(lang);

	return { title: page?.seo?.metaTitle ?? (page && withoutBreaks(page.title)), description: page?.seo?.metaDescription ?? page?.lead ?? undefined };
}

export default async function PartnershipsPage({ params }: PageProps<'/[lang]/partnerships'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const page = await getPartnershipsPage(lang);
	if (!page) notFound();

	return <TemplatePartnershipsPage lang={lang} page={page} />;
}
