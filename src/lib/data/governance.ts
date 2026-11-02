import type { Locale } from '@/i18n/config';
import type { GovernanceBody } from '@/lib/data/about';
import { TRANSLATIONS_QUERY } from '@/lib/data/global';
import { strapiGet } from '@/lib/strapi/client';
import type { Collection, Media, Taxonomy, Translation } from '@/lib/strapi/types';

export type Person = {
	documentId: string;
	name: string;
	jobTitle: string | null;
	organisation: string | null;
	bio: string | null;
	photo: Media | null;
	personGroups: Pick<Taxonomy, 'slug'>[];
};

// A body's people, under the child group they belong to (Leadership, Board). People in the body itself have no group.
export type PeopleGroup = { group: Taxonomy | null; people: Person[] };

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];

// A governance body is a top-level person group, so a child group's slug does not open a page of its own.
export async function getGovernanceBody(lang: Locale, slug: string) {
	const { data } = await strapiGet<Collection<GovernanceBody & { localizations: Translation[] }>>(
		'/person-groups',
		{
			locale: lang,
			fields: ['name', 'slug', 'description'],
			filters: { slug: { $eq: slug }, parent: { id: { $null: true } } },
			populate: { image: { fields: MEDIA_FIELDS }, localizations: TRANSLATIONS_QUERY },
		},
		['person-group'],
	);

	return data[0] ?? null;
}

export async function getGovernancePeople(lang: Locale, body: GovernanceBody): Promise<PeopleGroup[]> {
	const { data: groups } = await strapiGet<Collection<Taxonomy>>(
		'/person-groups',
		{ locale: lang, fields: ['name', 'slug'], filters: { parent: { slug: { $eq: body.slug } } }, sort: ['order:asc', 'name:asc'] },
		['person-group'],
	);

	const { data: people } = await strapiGet<Collection<Person>>(
		'/people',
		{
			locale: lang,
			fields: ['name', 'jobTitle', 'organisation', 'bio'],
			filters: { personGroups: { slug: { $in: [body.slug, ...groups.map((group) => group.slug)] } } },
			populate: { photo: { fields: MEDIA_FIELDS }, personGroups: { fields: ['slug'] } },
			sort: ['order:asc', 'name:asc'],
			pagination: { page: 1, pageSize: 100 },
		},
		['person', 'person-group'],
	);

	const inGroup = (slug: string) => people.filter((person) => person.personGroups.some((group) => group.slug === slug));

	return [{ group: null, people: inGroup(body.slug) }, ...groups.map((group) => ({ group, people: inGroup(group.slug) }))].filter(({ people }) => people.length > 0);
}
