import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentBody from '@/components/content-body/ContentBody';
import PartnersContribution from '@/components/partners-contribution/PartnersContribution';
import ProjectHeader from '@/components/project-header/ProjectHeader';
import ProjectOverview from '@/components/project-overview/ProjectOverview';
import ProjectResults from '@/components/project-results/ProjectResults';
import ProjectTile from '@/components/project-tile/ProjectTile';
import RelatedContent from '@/components/related-content/RelatedContent';
import StoryTile from '@/components/story-tile/StoryTile';
import TestimonialCarousel from '@/components/testimonial-carousel/TestimonialCarousel';
import { withoutBreaks } from '@/components/text-with-breaks/TextWithBreaks';
import { hasLocale, localisedPath } from '@/i18n/config';
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

// Each section renders only when the project has content for it, so a project with less detail gets a shorter page.
export default async function ProjectPage({ params }: PageProps<'/[lang]/our-projects/[slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();

	const [project, dictionary] = await Promise.all([getProject(lang, slug), getDictionary(lang)]);
	if (!project) notFound();

	const [stories, relatedProjects] = await Promise.all([
		getRelatedStories(lang, { projectSlug: project.slug, country: project.country, focusArea: project.focusArea }, RELATED_LIMIT),
		getRelatedProjects(lang, project, RELATED_LIMIT),
	]);
	const { project: labels, carousel } = dictionary;

	return (
		<>
			{/* One section for the header and the project's own content, so its bottom spacing clears the rounded section after it
			    whichever parts the project has. */}
			<div className="rsg-module section-wrapper-small">
				<ProjectHeader lang={lang} project={project} labels={labels} />

				<ProjectOverview lang={lang} targetReach={project.targetReach} countryContext={project.countryContext} labels={labels} />

				<ContentBody lang={lang} sections={project.body} />
			</div>

			{project.expectedResults.length > 0 && <ProjectResults id="expected-results-title" title={labels.expectedResults} palette="yellow" items={project.expectedResults} />}

			{project.progress.length > 0 && (
				<ProjectResults id="progress-title" title={labels.progress} palette="dark" items={project.progress.map((stat) => ({ heading: stat.value, text: stat.description }))} />
			)}

			{project.financing.length > 0 && <PartnersContribution title={labels.partnersContribution} groups={project.financing} />}

			{project.testimonials.length > 0 && <TestimonialCarousel title={labels.testimonials} context={withoutBreaks(project.title)} testimonials={project.testimonials} labels={carousel} />}

			{stories.length > 0 && (
				<RelatedContent id="related-stories-title" title={labels.relatedStories} palette="light" viewAll={{ label: labels.viewAllStories, href: localisedPath(lang, '/field-updates') }} labels={carousel}>
					{stories.map((story) => (
						<StoryTile key={story.documentId} lang={lang} story={story} palette="light" />
					))}
				</RelatedContent>
			)}

			{relatedProjects.length > 0 && (
				<RelatedContent id="related-projects-title" title={labels.relatedProjects} palette="dark" viewAll={{ label: labels.viewAllProjects, href: localisedPath(lang, '/our-projects') }} labels={carousel}>
					{relatedProjects.map((related) => (
						<ProjectTile key={related.documentId} lang={lang} project={related} palette="dark" />
					))}
				</RelatedContent>
			)}
		</>
	);
}
