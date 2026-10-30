import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockStacked from '@/components/contents/blocks/content-box-block/content-box-block-stacked';
import CountriesBlockStandard from '@/components/contents/blocks/countries-block/countries-block-standard';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import PartnersBlockAccordion from '@/components/contents/blocks/partners-block/partners-block-accordion';
import StatisticBlockStandard from '@/components/contents/blocks/statistic-block/statistic-block-standard';
import PersonGroupTileStandard from '@/components/contents/post-types/tiles/person-group/person-group-standard';
import { hasLocale, resolveHref, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getAboutPage, getCountries, getFocusAreas, getGovernanceBodies, getPartners } from '@/lib/data/about';
import type { CardGroup, SectionHeader } from '@/lib/strapi/types';

// The cards' column: four across from lg up, two from md, one on mobile.
const CARD_COLUMNS = 'col-12 col-md-6 col-lg-3';
// Focus area and governance cards: three across from lg up.
const THIRD_COLUMNS = 'col-12 col-md-6 col-lg-4';
// The partners and countries sit in the middle two-thirds of the page, as in the design.
const NARROW_COLUMN = 'col-12 col-lg-8 offset-lg-2';

// A section header's copy, without the component's own numeric id.
const sectionHeading = ({ label, title, text }: SectionHeader) => ({ label, title, text });

// Our model and Partner with us: icon cards over the section's background photo, with the section's link below.
function CardGroupSection({ lang, id, group }: { lang: Locale; id: string; group: CardGroup }) {
	return (
		<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="dark" backgroundImage={group.image}>
			<GroupedContentBlockStandard
				heading={{ id, label: group.label, title: group.title, text: group.text }}
				classes="center-aligned boxed-items"
				colClasses={CARD_COLUMNS}
				items={group.cards.map((card) => ({
					key: String(card.id),
					content: <ContentBoxBlockStacked icon={card.icon} title={card.title} text={card.text} palette="dark" classes="center-aligned" />,
				}))}
				links={
					group.linkLabel &&
					group.linkUrl && (
						<Link className="rsg-button" href={resolveHref(lang, group.linkUrl)}>
							{group.linkLabel}
						</Link>
					)
				}
			/>
		</BaseWrapper>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/about-us'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getAboutPage(lang);

	return { title: page?.seo?.metaTitle ?? page?.title, description: page?.seo?.metaDescription ?? page?.intro?.text ?? undefined };
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about-us'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary, focusAreas, governanceBodies, partners, countries] = await Promise.all([
		getAboutPage(lang),
		getDictionary(lang),
		getFocusAreas(lang),
		getGovernanceBodies(lang),
		getPartners(lang),
		getCountries(lang),
	]);
	if (!page) notFound();

	const { intro, model, governance, partnerWithUs } = page;
	const focusAreaCard = (area: (typeof focusAreas)[number]) => ({
		key: area.documentId,
		content: <ContentBoxBlockStacked icon={area.icon} title={area.name} text={area.description} palette="light" />,
	});

	return (
		<>
			{/* The intro opens the page, so its title is the page's heading. */}
			<BaseWrapper wrapperClasses="section-wrapper-small" brand="dark">
				<GroupedContentBlockStandard
					heading={{
						id: 'about-intro-title',
						label: intro?.label,
						title: intro?.title ?? page.title,
						text: intro?.text,
						titleTag: 'h1',
						media: intro?.image && <MediaBlockStandard image={intro.image} aspectRatio="9x10" sizes="(min-width: 992px) 480px, 90vw" alt="" preload />,
					}}
					classes="shield-media"
					colClasses="col-4 col-sm-3"
					items={(intro?.stats ?? []).map((stat, index) => ({
						key: String(index),
						content: <StatisticBlockStandard statistic={stat.value} prefix={stat.label} footnote={stat.description} />,
					}))}
				/>
			</BaseWrapper>

			{model && <CardGroupSection lang={lang} id="about-model-title" group={model} />}

			<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="light">
				{page.focusAreas && (
					<GroupedContentBlockStandard
						heading={{ ...sectionHeading(page.focusAreas), id: 'about-focus-areas-title' }}
						classes="center-aligned boxed-items"
						colClasses={THIRD_COLUMNS}
						items={focusAreas.filter((area) => !area.isCrossCutting).map(focusAreaCard)}
					/>
				)}

				{page.crossCutting && (
					<GroupedContentBlockStandard
						heading={{ ...sectionHeading(page.crossCutting), id: 'about-cross-cutting-title' }}
						classes="split-view boxed-items"
						colClasses="col-12 col-md-6"
						items={focusAreas.filter((area) => area.isCrossCutting).map(focusAreaCard)}
					/>
				)}
			</BaseWrapper>

			{governance && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="dark">
					<GroupedContentBlockStandard
						heading={{ ...sectionHeading(governance), id: 'about-governance-title' }}
						classes="center-aligned boxed-items"
						colClasses={THIRD_COLUMNS}
						items={governanceBodies.map((group) => ({
							key: group.documentId,
							content: (
								<PersonGroupTileStandard
									lang={lang}
									group={group}
									palette={group.slug === governance.highlight?.slug ? 'yellow' : 'dark'}
									readMore={dictionary.about.readMore}
								/>
							),
						}))}
					/>
				</BaseWrapper>
			)}

			{page.partners && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="light" colClasses={NARROW_COLUMN}>
					<PartnersBlockAccordion
						id="partners"
						heading={{ ...sectionHeading(page.partners), id: 'about-partners-title' }}
						partners={partners}
						palette="light"
						opensInNewTab={dictionary.about.opensInNewTab}
					/>
				</BaseWrapper>
			)}

			{page.countries && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="dark" colClasses={NARROW_COLUMN}>
					<CountriesBlockStandard lang={lang} heading={{ ...sectionHeading(page.countries), id: 'about-countries-title' }} countries={countries} />
				</BaseWrapper>
			)}

			{partnerWithUs && <CardGroupSection lang={lang} id="about-partner-with-us-title" group={partnerWithUs} />}
		</>
	);
}
