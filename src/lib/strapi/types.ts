// Shapes of the Strapi responses this site reads. They describe only the fields each query requests, not whole content types.

export type Media = {
	url: string;
	alternativeText: string | null;
	width: number;
	height: number;
};

export type Stat = {
	label: string | null;
	value: string;
	description: string | null;
};

export type Taxonomy = {
	documentId: string;
	name: string;
	slug: string;
};

export type PageHero = {
	eyebrow: string | null;
	title: string;
	text: string | null;
	image: Media | null;
};

export type CallToAction = {
	title: string;
	text: string | null;
	linkLabel: string | null;
	linkUrl: string | null;
	image: Media | null;
};

export type Seo = {
	metaTitle: string;
	metaDescription: string;
};

export type Single<T> = { data: T | null };

export type Collection<T> = {
	data: T[];
	meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};
