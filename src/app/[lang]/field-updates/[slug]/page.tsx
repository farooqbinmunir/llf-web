import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withoutBreaks } from '@/components/helpers/text-with-breaks';
import StructuredData from '@/components/helpers/structured-data';
import SingleStory from '@/components/views/single-story';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getGlobal } from '@/lib/data/global';
import { getRelatedStories, getStory, getStorySlugs } from '@/lib/data/stories';
import { articleData, pageMetadata, translatedPaths } from '@/lib/metadata';

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

	return pageMetadata(lang, {
		path: `/field-updates/${story.slug}`,
		paths: translatedPaths(lang, '/field-updates', story),
		seo: story.seo,
		title: withoutBreaks(story.title),
		description: story.excerpt,
		image: story.coverImage,
		publishedTime: story.publishDate,
	});
}

export default async function StoryPage({ params }: PageProps<'/[lang]/field-updates/[slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();

	const [story, dictionary, site] = await Promise.all([getStory(lang, slug), getDictionary(lang), getGlobal(lang)]);
	if (!story) notFound();

	const related = await getRelatedStories(lang, { projectSlug: story.project?.slug, country: story.country, focusArea: story.focusArea, excludeSlug: story.slug }, RELATED_LIMIT);

	const article = { title: withoutBreaks(story.title), description: story.excerpt, image: story.coverImage, publishDate: story.publishDate };

	return (
		<>
			<SingleStory lang={lang} story={story} related={related} dictionary={dictionary} />
			<StructuredData data={articleData(lang, `/field-updates/${story.slug}`, site, article)} />
		</>
	);
}
