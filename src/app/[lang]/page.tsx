import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Sections from '@/components/contents/blocks/sections';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import StructuredData from '@/components/helpers/structured-data';
import { hasLocale } from '@/i18n/config';
import { getGlobal } from '@/lib/data/global';
import { getHomePage } from '@/lib/data/home';
import { organisationData, pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getHomePage(lang);

	// No title, so the site name (the layout's default) is the home page's title, unless the editors set one.
	return pageMetadata(lang, { path: '/', seo: page?.seo, description: page?.hero?.text, image: page?.hero?.image });
}

// The home page: its hero, then the sections the editors set in the CMS.
export default async function HomePage({ params }: PageProps<'/[lang]'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, site] = await Promise.all([getHomePage(lang), getGlobal(lang)]);
	if (!page) notFound();

	return (
		<>
			{page.hero ? <HeaderContentsSingle hero={page.hero} layout="full-height" /> : <h1 className="rsg-visually-hidden">{page.title}</h1>}

			<Sections lang={lang} sections={page.sections} />

			{site && <StructuredData data={organisationData(lang, site)} />}
		</>
	);
}
