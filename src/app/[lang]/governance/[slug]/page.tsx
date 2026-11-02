import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import ListingBlockStandard from '@/components/contents/blocks/listing-block/listing-block-standard';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import PersonTileStandard from '@/components/contents/post-types/tiles/person/person-standard';
import PersonGroupTileStandard from '@/components/contents/post-types/tiles/person-group/person-group-standard';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getGovernanceBodies } from '@/lib/data/about';
import { getGovernanceBody, getGovernancePeople } from '@/lib/data/governance';

// People and the Explore cards: three across from lg up, two from sm.
const THIRD_COLUMNS = 'col-12 col-sm-6 col-lg-4';
const PERSON_SIZES = '(min-width: 992px) 30vw, (min-width: 576px) 45vw, 90vw';

// As for the other detail routes (M06): the page reads the slug before rendering, so an unknown slug, or a child group's
// slug, answers a real 404.
export const instant = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
	if (!hasLocale(params.lang)) return [];

	return (await getGovernanceBodies(params.lang)).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/governance/[slug]'>): Promise<Metadata> {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) return {};

	const body = await getGovernanceBody(lang, slug);
	if (!body) return {};

	return { title: body.name, description: body.description ?? undefined };
}

export default async function GovernancePage({ params }: PageProps<'/[lang]/governance/[slug]'>) {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();

	const [body, dictionary, bodies] = await Promise.all([getGovernanceBody(lang, slug), getDictionary(lang), getGovernanceBodies(lang)]);
	if (!body) notFound();

	const peopleGroups = await getGovernancePeople(lang, body);

	return (
		<>
			<HeaderContentsSingle hero={{ eyebrow: dictionary.governance.label, title: body.name, text: body.description, image: body.image }} layout="image-above" />

			{peopleGroups.length > 0 && (
				<BaseWrapper wrapperClasses="section-wrapper-small" brand="light">
					<ListingBlockStandard
						classes="center-aligned"
						colClasses={THIRD_COLUMNS}
						groups={peopleGroups.map(({ group, people }) => ({
							key: group?.slug ?? body.slug,
							title: group?.name,
							tiles: people.map((person) => ({ key: person.documentId, tile: <PersonTileStandard person={person} sizes={PERSON_SIZES} /> })),
						}))}
					/>
				</BaseWrapper>
			)}

			<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="dark">
				<GroupedContentBlockStandard
					heading={{ id: 'governance-explore-title', label: dictionary.governance.explore }}
					classes="center-aligned boxed-items"
					colClasses={THIRD_COLUMNS}
					items={bodies
						.filter((other) => other.slug !== body.slug)
						.map((other) => ({
							key: other.documentId,
							content: <PersonGroupTileStandard lang={lang} group={other} palette="dark" readMore={dictionary.about.readMore} />,
						}))}
				/>
			</BaseWrapper>
		</>
	);
}
