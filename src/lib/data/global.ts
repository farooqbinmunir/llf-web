import type { Locale } from '@/i18n/config';
import { strapiGet } from '@/lib/strapi/client';
import type { Media, Single } from '@/lib/strapi/types';

export type SocialNetwork = 'linkedin' | 'facebook' | 'x' | 'instagram' | 'youtube';

export type SocialLink = { network: SocialNetwork; url: string };

// Site-wide settings: the name and description pages fall back to, the default share image and LLF's social accounts.
export type Global = {
	siteName: string;
	siteDescription: string;
	shareImage: Media | null;
	socialLinks: SocialLink[];
};

const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];

// The `seo` component as every page query requests it; its share image is media, so it needs its own populate.
export const SEO_QUERY = { populate: { shareImage: { fields: MEDIA_FIELDS } } };
// Each translation's slug, for the alternate language links of a detail page.
export const TRANSLATIONS_QUERY = { fields: ['slug', 'locale'] };

export async function getGlobal(lang: Locale) {
	const { data } = await strapiGet<Single<Global>>('/global', { locale: lang, populate: { shareImage: { fields: MEDIA_FIELDS }, socialLinks: true } }, ['global']);

	return data;
}
