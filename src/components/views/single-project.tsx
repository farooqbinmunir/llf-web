import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBlocks from '@/components/contents/blocks/content-blocks';
import GroupedContentBlockFinancing from '@/components/contents/blocks/grouped-content-block/grouped-content-block-financing';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import ListingBlockCarousel from '@/components/contents/blocks/listing-block/listing-block-carousel';
import StatisticBlockStandard from '@/components/contents/blocks/statistic-block/statistic-block-standard';
import TestimonialBlockStandard from '@/components/contents/blocks/testimonial-block/testimonial-block-standard';
import TextBoxBlockStandard from '@/components/contents/blocks/text-box-block/text-box-block-standard';
import ProjectHeaderStandard from '@/components/contents/post-types/header-contents/project/project-standard';
import ProjectTileStandard from '@/components/contents/post-types/tiles/project/project-standard';
import StoryTileStandard from '@/components/contents/post-types/tiles/story/story-standard';
import { withoutBreaks } from '@/components/helpers/text-with-breaks';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { ProjectCard, ProjectDetail } from '@/lib/data/projects';
import type { StoryCard } from '@/lib/data/stories';

type SingleProjectProps = { lang: Locale; project: ProjectDetail; stories: StoryCard[]; relatedProjects: ProjectCard[]; dictionary: Dictionary };

const SECTION = 'section-wrapper-small section-rounded-top';
const CENTRED_COLUMN = 'col-12 col-lg-8 offset-lg-2';

// A project page. Each part renders only when the project has content for it, so a project with less detail gets a
// shorter page.
export default function SingleProject({ lang, project, stories, relatedProjects, dictionary }: SingleProjectProps) {
	const { project: labels, carousel } = dictionary;
	const hasContext = project.countryContext !== null && project.countryContext.length > 0;

	return (
		<>
			<article className="single-project-content">
				<ProjectHeaderStandard lang={lang} project={project} labels={labels} />

				{/* Target reach beside the country context. The design allows one to three reach figures. */}
				{(project.targetReach.length > 0 || hasContext) && (
					<div className="container-xxl">
						<div className="row rsg-overview">
							{project.targetReach.length > 0 && (
								<div className="col col-12 col-md-6 col-lg-4 offset-lg-2">
									<GroupedContentBlockStandard
										heading={{ id: 'target-reach-title', title: labels.targetReach }}
										colClasses="col-12"
										items={project.targetReach.map((stat) => ({ key: stat.value, content: <StatisticBlockStandard statistic={stat.value} footnote={stat.description} /> }))}
									/>
								</div>
							)}

							{hasContext && (
								<div className="col col-12 col-md-6 col-lg-4">
									<TextBoxBlockStandard lang={lang} title={labels.countryContext} text={project.countryContext} />
								</div>
							)}
						</div>
					</div>
				)}

				<div className="rsg-article-body">
					<ContentBlocks lang={lang} sections={project.body} />
				</div>
			</article>

			{project.expectedResults.length > 0 && (
				<BaseWrapper wrapperClasses={SECTION} brand="yellow" colClasses={CENTRED_COLUMN}>
					<GroupedContentBlockStandard
						classes="center-aligned top-border"
						heading={{ id: 'expected-results-title', title: labels.expectedResults }}
						colClasses="col-12 col-md-6"
						items={project.expectedResults.map((result) => ({ key: result.text, content: <StatisticBlockStandard footnote={result.text} /> }))}
					/>
				</BaseWrapper>
			)}

			{project.progress.length > 0 && (
				<BaseWrapper wrapperClasses={SECTION} brand="dark" colClasses={CENTRED_COLUMN}>
					<GroupedContentBlockStandard
						classes="center-aligned top-border"
						heading={{ id: 'progress-title', title: labels.progress }}
						colClasses="col-12 col-md-6"
						items={project.progress.map((stat) => ({ key: stat.value, content: <StatisticBlockStandard statistic={stat.value} footnote={stat.description} /> }))}
					/>
				</BaseWrapper>
			)}

			{project.financing.length > 0 && (
				<BaseWrapper wrapperClasses={SECTION} brand="light" colClasses={CENTRED_COLUMN}>
					<GroupedContentBlockFinancing heading={{ id: 'partners-contribution-title', title: labels.partnersContribution }} groups={project.financing} />
				</BaseWrapper>
			)}

			{project.testimonials.length > 0 && (
				<BaseWrapper wrapperClasses={SECTION} brand="dark" colClasses={CENTRED_COLUMN}>
					<TestimonialBlockStandard
						heading={{ id: 'testimonials-title', label: labels.testimonials, text: withoutBreaks(project.title) }}
						testimonials={project.testimonials}
						carouselLabels={carousel}
					/>
				</BaseWrapper>
			)}

			{stories.length > 0 && (
				<BaseWrapper wrapperClasses={SECTION} brand="light">
					<ListingBlockCarousel
						heading={{ id: 'related-stories-title', label: labels.relatedStories }}
						viewAll={{ label: labels.viewAllStories, href: localisedPath(lang, '/field-updates') }}
						carouselLabels={carousel}
					>
						{stories.map((story) => (
							<StoryTileStandard key={story.documentId} lang={lang} story={story} palette="light" />
						))}
					</ListingBlockCarousel>
				</BaseWrapper>
			)}

			{relatedProjects.length > 0 && (
				<BaseWrapper wrapperClasses={SECTION} brand="dark">
					<ListingBlockCarousel
						heading={{ id: 'related-projects-title', label: labels.relatedProjects }}
						viewAll={{ label: labels.viewAllProjects, href: localisedPath(lang, '/our-projects') }}
						carouselLabels={carousel}
					>
						{relatedProjects.map((related) => (
							<ProjectTileStandard key={related.documentId} lang={lang} project={related} palette="dark" />
						))}
					</ListingBlockCarousel>
				</BaseWrapper>
			)}
		</>
	);
}
