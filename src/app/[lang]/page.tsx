import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockCta from '@/components/contents/blocks/content-box-block/content-box-block-cta';
import ContentBoxBlockPromo from '@/components/contents/blocks/content-box-block/content-box-block-promo';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import ListingBlockSlider from '@/components/contents/blocks/listing-block/listing-block-slider';
import ListingBlockStandard from '@/components/contents/blocks/listing-block/listing-block-standard';
import MapBlockStandard from '@/components/contents/blocks/map-block/map-block-standard';
import PartnersBlockStandard from '@/components/contents/blocks/partners-block/partners-block-standard';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import NewsTileList from '@/components/contents/post-types/tiles/news/news-list';
import ProjectTileStandard from '@/components/contents/post-types/tiles/project/project-standard';
import ResourceTileStandard from '@/components/contents/post-types/tiles/resource/resource-standard';
import StoryTileSlide from '@/components/contents/post-types/tiles/story/story-slide';
import StoryTileStandard from '@/components/contents/post-types/tiles/story/story-standard';
import { hasLocale, localisedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getCountries, getPartners } from '@/lib/data/about';
import { getHomePage } from '@/lib/data/home';
import { getLatestNews } from '@/lib/data/news';
import type { SectionHeader } from '@/lib/strapi/types';

const NEWS_COUNT = 3;
const ROUNDED_SECTION = 'section-wrapper-small section-rounded-top';

// A section header's copy under the id that names its block.
const sectionHeading = ({ label, title, text }: SectionHeader, id: string) => ({ id, label, title, text });

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getHomePage(lang);

	// The site name is the home page's title (the layout's default), unless the editors set one.
	return { title: page?.seo?.metaTitle, description: page?.seo?.metaDescription ?? page?.hero?.text ?? undefined };
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary, partners, countries, news] = await Promise.all([getHomePage(lang), getDictionary(lang), getPartners(lang), getCountries(lang), getLatestNews(lang, NEWS_COUNT)]);
	if (!page) notFound();

	const { home, carousel } = dictionary;
	const { hero, impact, about, featuredProjects, featuredStories, featuredResources, cta } = page;
	const viewAllStories = { label: home.viewAllStories, href: localisedPath(lang, '/field-updates') };

	return (
		<>
			{hero ? <HeaderContentsSingle hero={hero} layout="full-height" /> : <h1 className="rsg-visually-hidden">{page.title}</h1>}

			{(impact || about) && (
				<BaseWrapper wrapperClasses={ROUNDED_SECTION} brand="dark">
					{impact && <MapBlockStandard heading={sectionHeading(impact, 'home-impact-title')} stats={impact.stats} countries={countries} />}
					{about && <ContentBoxBlockPromo lang={lang} id="home-about-title" promo={about} />}
				</BaseWrapper>
			)}

			{page.partners && (
				<BaseWrapper wrapperClasses={ROUNDED_SECTION} brand="light">
					<PartnersBlockStandard
						heading={sectionHeading(page.partners, 'home-partners-title')}
						partners={partners}
						palette="light"
						links={
							<Link className="rsg-button" href={`${localisedPath(lang, '/about-us')}#partners`}>
								{home.meetPartners}
							</Link>
						}
					/>
				</BaseWrapper>
			)}

			{page.projects && featuredProjects.length > 0 && (
				<BaseWrapper wrapperClasses={ROUNDED_SECTION} brand="dark">
					<ListingBlockCarousel
						heading={sectionHeading(page.projects, 'home-projects-title')}
						viewAll={{ label: home.viewAllProjects, href: localisedPath(lang, '/our-projects') }}
						carouselLabels={carousel}
						classes="center-aligned"
					>
						{featuredProjects.map((project) => (
							<ProjectTileStandard key={project.documentId} lang={lang} project={project} palette="dark" />
						))}
					</ListingBlockCarousel>
				</BaseWrapper>
			)}

			{/* Stories of change is designed as story tiles on a light section on mobile and as a full-width photo slider from
			    lg up, so both are rendered and each is shown at its own widths. */}
			{page.stories && featuredStories.length > 0 && (
				<>
					<BaseWrapper wrapperClasses={`${ROUNDED_SECTION} d-lg-none`} brand="light">
						<ListingBlockCarousel heading={sectionHeading(page.stories, 'home-stories-title')} viewAll={viewAllStories} carouselLabels={carousel}>
							{featuredStories.map((story) => (
								<StoryTileStandard key={story.documentId} lang={lang} story={story} palette="light" />
							))}
						</ListingBlockCarousel>
					</BaseWrapper>

					<BaseWrapper wrapperClasses="section-rounded-top d-none d-lg-block" brand="dark" fullWidth>
						<ListingBlockSlider heading={{ id: 'home-stories-slider-title', label: page.stories.label, title: page.stories.title }} viewAll={viewAllStories} carouselLabels={carousel}>
							{featuredStories.map((story) => (
								<StoryTileSlide key={story.documentId} lang={lang} story={story} labels={home} />
							))}
						</ListingBlockSlider>
					</BaseWrapper>
				</>
			)}

			{page.news && news.length > 0 && (
				<BaseWrapper wrapperClasses={ROUNDED_SECTION} brand="dark">
					<ListingBlockStandard
						heading={sectionHeading(page.news, 'home-news-title')}
						classes="split-view"
						viewAll={{ label: dictionary.announcements.viewAllNews, href: localisedPath(lang, '/news') }}
						tiles={news.map((item) => ({ key: item.documentId, tile: <NewsTileList lang={lang} news={item} /> }))}
					/>
				</BaseWrapper>
			)}

			{page.library && featuredResources.length > 0 && (
				<BaseWrapper wrapperClasses={ROUNDED_SECTION} brand="light">
					<ListingBlockCarousel
						heading={sectionHeading(page.library, 'home-library-title')}
						viewAll={{ label: home.browseLibrary, href: localisedPath(lang, '/library') }}
						carouselLabels={carousel}
						classes="split-view"
					>
						{featuredResources.map((resource) => (
							<ResourceTileStandard key={resource.documentId} lang={lang} resource={resource} palette="light" labels={dictionary.library} />
						))}
					</ListingBlockCarousel>
				</BaseWrapper>
			)}

			{cta && (
				<BaseWrapper wrapperClasses={ROUNDED_SECTION} brand="dark" backgroundImage={cta.image}>
					<ContentBoxBlockCta lang={lang} cta={cta} />
				</BaseWrapper>
			)}
		</>
	);
}
