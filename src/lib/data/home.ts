import type { Locale } from '@/i18n/config';
import { sectionsQuery, type Section } from '@/lib/data/blocks';
import { SEO_QUERY } from '@/lib/data/global';
import { strapiGet } from '@/lib/strapi/client';
import type { PageHero, Seo, Single } from '@/lib/strapi/types';

export type HomePage = {
	title: string;
	hero: PageHero | null;
	sections: Section[];
	seo: Seo | null;
};

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];

export async function getHomePage(lang: Locale) {
	const { data } = await strapiGet<Single<HomePage>>(
		'/home-page',
		{
			locale: lang,
			populate: {
				hero: { populate: { image: { fields: MEDIA_FIELDS } } },
				sections: sectionsQuery(),
				seo: SEO_QUERY,
			},
		},
		['home-page', 'project', 'story', 'resource'],
	);

	return data;
}
