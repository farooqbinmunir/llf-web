import type { Locale } from '@/i18n/config';
import { strapiGet } from '@/lib/strapi/client';
import type { BlocksNode, Download, Seo, Single } from '@/lib/strapi/types';

// The pages that ask visitors to get in touch: Contact (with the enquiry form's copy), Funding queries and Partnerships.

export type ContactChannel = {
	id: number;
	title: string;
	text: string | null;
	linkLabel: string | null;
	linkUrl: string | null;
	download: Download | null;
};

export type ContactPage = {
	title: string;
	intro: string | null;
	channels: ContactChannel[];
	followTitle: string | null;
	newsletter: { title: string; text: string | null; successText: string | null } | null;
	form: { title: string; text: string | null; successTitle: string | null; successText: string | null } | null;
	seo: Seo | null;
};

export type FundingPage = {
	label: string | null;
	title: string;
	body: BlocksNode[] | null;
	aside: BlocksNode[] | null;
	guidelines: Download | null;
	seo: Seo | null;
};

export type PartnershipsPage = {
	title: string;
	lead: string | null;
	body: BlocksNode[] | null;
	whyTitle: string | null;
	why: BlocksNode[] | null;
	linkLabel: string | null;
	linkUrl: string | null;
	seo: Seo | null;
};

const DOWNLOAD = { populate: { resource: { fields: ['externalUrl'], populate: { file: { fields: ['url', 'ext'] } } } } };

export async function getContactPage(lang: Locale) {
	const { data } = await strapiGet<Single<ContactPage>>(
		'/contact-page',
		{ locale: lang, populate: { channels: { populate: { download: DOWNLOAD } }, newsletter: true, form: true, seo: true } },
		['contact-page', 'resource'],
	);

	return data;
}

export async function getFundingPage(lang: Locale) {
	const { data } = await strapiGet<Single<FundingPage>>('/funding-page', { locale: lang, populate: { guidelines: DOWNLOAD, seo: true } }, ['funding-page', 'resource']);

	return data;
}

export async function getPartnershipsPage(lang: Locale) {
	const { data } = await strapiGet<Single<PartnershipsPage>>('/partnerships-page', { locale: lang, populate: { seo: true } }, ['partnerships-page']);

	return data;
}
