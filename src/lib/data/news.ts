import type { Locale } from '@/i18n/config';
import { strapiGet } from '@/lib/strapi/client';
import type { Collection, Media } from '@/lib/strapi/types';

export type NewsCard = {
	documentId: string;
	title: string;
	slug: string;
	publishDate: string | null;
	coverImage: Media | null;
};

// The newest news items, as the "Latest announcements" block lists them.
export async function getLatestNews(lang: Locale, limit: number) {
	const { data } = await strapiGet<Collection<NewsCard>>(
		'/news',
		{
			locale: lang,
			fields: ['title', 'slug', 'publishDate'],
			populate: { coverImage: { fields: ['url', 'alternativeText', 'width', 'height'] } },
			sort: ['publishDate:desc', 'title:asc'],
			pagination: { page: 1, pageSize: limit },
		},
		['news-item'],
	);

	return data;
}
