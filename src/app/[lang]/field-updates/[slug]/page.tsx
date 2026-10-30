import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentBody from '@/components/content-body/ContentBody';
import RelatedContent from '@/components/related-content/RelatedContent';
import StoryFootnotes from '@/components/story-footnotes/StoryFootnotes';
import StoryHeader from '@/components/story-header/StoryHeader';
import StoryTile from '@/components/story-tile/StoryTile';
import { withoutBreaks } from '@/components/text-with-breaks/TextWithBreaks';
import { hasLocale, localisedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getRelatedStories, getStory, getStorySlugs } from '@/lib/data/stories';

const RELATED_LIMIT = 8;

// As for projects (M06): the page reads the slug before rendering, so an unknown slug answers a real 404, and seeded
// slugs are prerendered anyway.
export const instant = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
	if (!hasLocale(params.lang)) return [];

	return (await getStorySlugs(params.lang)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/field-updates/[slug]'>): Promise<Metadata> {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) return {};

	const story = await getStory(lang, slug);
	if (!story) return {};

	return { title: story.seo?.metaTitle ?? withoutBreaks(story.title), description: story.seo?.metaDescription ?? story.excerpt ?? undefined };
}

export default async function StoryPage({ params }: PageProps<'/[lang]/field-updates/[slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();

	const [story, dictionary] = await Promise.all([getStory(lang, slug), getDictionary(lang)]);
	if (!story) notFound();

	const related = await getRelatedStories(lang, { projectSlug: story.project?.slug, country: story.country, focusArea: story.focusArea, excludeSlug: story.slug }, RELATED_LIMIT);
	const { story: labels, carousel } = dictionary;

	return (
		<>
			{/* One section for the story itself, so its bottom spacing clears the rounded section after it whichever parts it has. */}
			<article className="rsg-module section-wrapper-small">
				<StoryHeader lang={lang} story={story} labels={labels} playerLabels={dictionary.videoPlayer} />

				<ContentBody lang={lang} sections={story.body} />

				{story.footnotes && story.footnotes.length > 0 && <StoryFootnotes lang={lang} label={labels.footnotes} content={story.footnotes} />}
			</article>

			{related.length > 0 && (
				<RelatedContent id="related-stories-title" title={labels.relatedStories} palette="light" viewAll={{ label: labels.viewAllStories, href: localisedPath(lang, '/field-updates') }} labels={carousel}>
					{related.map((relatedStory) => (
						<StoryTile key={relatedStory.documentId} lang={lang} story={relatedStory} palette="light" />
					))}
				</RelatedContent>
			)}
		</>
	);
}
