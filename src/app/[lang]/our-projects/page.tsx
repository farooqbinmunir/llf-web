import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CtaBanner from '@/components/cta-banner/CtaBanner';
import ImpactStats from '@/components/impact-stats/ImpactStats';
import PageHero from '@/components/page-hero/PageHero';
import ProjectListing from '@/components/project-listing/ProjectListing';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProjectsPage } from '@/lib/data/projects';

export async function generateMetadata({ params }: PageProps<'/[lang]/our-projects'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getProjectsPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function OurProjectsPage({ params, searchParams }: PageProps<'/[lang]/our-projects'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getProjectsPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	return (
		<>
			{page.hero && <PageHero hero={page.hero} />}

			{/* The listing reads the URL's filters, so it streams in while the rest of the page is served from the static shell. */}
			<ProjectListing lang={lang} searchParams={searchParams} labels={dictionary.projects} introTitle={page.introTitle} introText={page.introText} />

			{page.impactStats.length > 0 && <ImpactStats title={page.impactTitle} text={page.impactText} stats={page.impactStats} />}

			{page.cta && <CtaBanner lang={lang} cta={page.cta} />}
		</>
	);
}
