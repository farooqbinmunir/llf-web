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

export type Testimonial = {
	quote: string;
	name: string | null;
	role: string | null;
	photo: Media | null;
};

// Strapi's blocks (rich text) format: a list of block nodes, each holding inline text and links.
export type BlocksText = { type: 'text'; text: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean };
export type BlocksLink = { type: 'link'; url: string; children: BlocksText[] };
export type BlocksInline = BlocksText | BlocksLink;
export type BlocksListItem = { type: 'list-item'; children: BlocksInline[] };
export type BlocksList = { type: 'list'; format: 'ordered' | 'unordered'; children: (BlocksListItem | BlocksList)[] };

export type BlocksNode =
	| { type: 'paragraph'; children: BlocksInline[] }
	| { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: BlocksInline[] }
	| { type: 'quote'; children: BlocksInline[] }
	| { type: 'code'; children: BlocksText[] }
	| BlocksList
	// Images and any block type added later are not rendered; the editor's image block is not used on this site.
	| { type: 'image' };

// Blocks of a `body` dynamic zone. Projects use text sections and media; stories use all of them.
export type BodySection =
	| { __component: 'shared.text-section'; id: number; heading: string | null; body: BlocksNode[] | null }
	| { __component: 'shared.media'; id: number; file: Media | null; caption: string | null }
	| { __component: 'shared.media-row'; id: number; items: { id: number; file: Media | null; caption: string | null }[] }
	| ({ __component: 'shared.testimonial'; id: number } & Testimonial)
	| { __component: 'shared.stat-row'; id: number; items: Stat[] }
	| { __component: 'shared.highlight'; id: number; heading: string | null; body: BlocksNode[] | null; quote: Testimonial | null };

export type Seo = {
	metaTitle: string;
	metaDescription: string;
};

export type Single<T> = { data: T | null };

export type Collection<T> = {
	data: T[];
	meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};
