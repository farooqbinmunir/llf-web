import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withoutBreaks } from '@/components/helpers/text-with-breaks';
import SingleProject from '@/components/views/single-project';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProject, getProjectSlugs, getRelatedProjects } from '@/lib/data/projects';
import { getRelatedStories } from '@/lib/data/stories';

const RELATED_LIMIT = 8;

// The page reads the slug before rendering, so navigation waits for it rather than streaming into a shared shell. That is
// what lets an unknown slug answer 404 rather than a soft not-found page with 200, and seeded slugs are prerendered anyway.
export const instant = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
	if (!hasLocale(params.lang)) return [];

	return (await getProjectSlugs(params.lang)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/our-projects/[slug]'>): Promise<Metadata> {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) return {};

	const project = await getProject(lang, slug);
	if (!project) return {};

	return { title: project.seo?.metaTitle ?? withoutBreaks(project.title), description: project.seo?.metaDescription ?? project.summary ?? undefined };
}

export default async function ProjectPage({ params }: PageProps<'/[lang]/our-projects/[slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();

	const [project, dictionary] = await Promise.all([getProject(lang, slug), getDictionary(lang)]);
	if (!project) notFound();

	const [stories, relatedProjects] = await Promise.all([
		getRelatedStories(lang, { projectSlug: project.slug, country: project.country, focusArea: project.focusArea }, RELATED_LIMIT),
		getRelatedProjects(lang, project, RELATED_LIMIT),
	]);

	return <SingleProject lang={lang} project={project} stories={stories} relatedProjects={relatedProjects} dictionary={dictionary} />;
}
