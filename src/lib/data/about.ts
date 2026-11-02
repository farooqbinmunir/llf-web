import type { Locale } from '@/i18n/config';
import { SEO_QUERY } from '@/lib/data/global';
import { strapiGet } from '@/lib/strapi/client';
import type { CardGroup, Collection, Media, SectionHeader, Seo, Single, Stat, Taxonomy } from '@/lib/strapi/types';

export type AboutPage = {
	title: string;
	intro: (SectionHeader & { image: Media | null; stats: Stat[] }) | null;
	model: CardGroup | null;
	focusAreas: SectionHeader | null;
	crossCutting: SectionHeader | null;
	governance: (SectionHeader & { highlight: { slug: string } | null }) | null;
	partners: SectionHeader | null;
	countries: SectionHeader | null;
	partnerWithUs: CardGroup | null;
	seo: Seo | null;
};

export type FocusArea = Taxonomy & { description: string | null; icon: Media | null; isCrossCutting: boolean };

export type GovernanceBody = Taxonomy & { description: string | null; image: Media | null };

export type Partner = {
	documentId: string;
	name: string;
	shortName: string | null;
	description: string | null;
	website: string | null;
	logo: Media | null;
	partnerType: (Taxonomy & { order: number | null }) | null;
};

// The coordinates place the country's pin on the home page map.
export type Country = Taxonomy & { latitude: number | null; longitude: number | null; region: (Taxonomy & { order: number | null }) | null };

// Partners in one group per partner type (Founding partners, Supporting partners), in the types' order.
export const groupByPartnerType = (partners: Partner[]) =>
	[...Map.groupBy(partners, (partner) => partner.partnerType?.slug ?? '').values()].sort((a, b) => (a[0].partnerType?.order ?? 0) - (b[0].partnerType?.order ?? 0));

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];
const CARD_GROUP = { populate: { image: { fields: MEDIA_FIELDS }, cards: { populate: { icon: { fields: MEDIA_FIELDS } } } } };

export async function getAboutPage(lang: Locale) {
	const { data } = await strapiGet<Single<AboutPage>>(
		'/about-page',
		{
			locale: lang,
			populate: {
				intro: { populate: { image: { fields: MEDIA_FIELDS }, stats: true } },
				model: CARD_GROUP,
				focusAreas: true,
				crossCutting: true,
				governance: { populate: { highlight: { fields: ['slug'] } } },
				partners: true,
				countries: true,
				partnerWithUs: CARD_GROUP,
				seo: SEO_QUERY,
			},
		},
		['about-page', 'person-group'],
	);

	return data;
}

export async function getFocusAreas(lang: Locale) {
	const { data } = await strapiGet<Collection<FocusArea>>(
		'/focus-areas',
		{ locale: lang, fields: ['name', 'slug', 'description', 'isCrossCutting'], populate: { icon: { fields: MEDIA_FIELDS } }, sort: ['order:asc', 'name:asc'] },
		['focus-area'],
	);

	return data;
}

// The governance bodies are the top-level person groups; their child groups (Leadership, Board) belong to the body's own page.
export async function getGovernanceBodies(lang: Locale) {
	const { data } = await strapiGet<Collection<GovernanceBody>>(
		'/person-groups',
		{
			locale: lang,
			fields: ['name', 'slug', 'description'],
			filters: { parent: { id: { $null: true } } },
			populate: { image: { fields: MEDIA_FIELDS } },
			sort: ['order:asc', 'name:asc'],
		},
		['person-group'],
	);

	return data;
}

export async function getPartners(lang: Locale) {
	const { data } = await strapiGet<Collection<Partner>>(
		'/partners',
		{
			locale: lang,
			fields: ['name', 'shortName', 'description', 'website'],
			populate: { logo: { fields: MEDIA_FIELDS }, partnerType: { fields: ['name', 'slug', 'order'] } },
			sort: ['order:asc', 'name:asc'],
			pagination: { page: 1, pageSize: 100 },
		},
		['partner'],
	);

	return data;
}

export async function getCountries(lang: Locale) {
	const { data } = await strapiGet<Collection<Country>>(
		'/countries',
		{ locale: lang, fields: ['name', 'slug', 'latitude', 'longitude'], populate: { region: { fields: ['name', 'slug', 'order'] } }, sort: ['name:asc'], pagination: { page: 1, pageSize: 100 } },
		['country'],
	);

	return data;
}
