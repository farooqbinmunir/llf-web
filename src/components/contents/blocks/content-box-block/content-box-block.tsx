import BaseWrapper, { settingsWrapperProps } from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockCta from '@/components/contents/blocks/content-box-block/content-box-block-cta';
import ContentBoxBlockPromo from '@/components/contents/blocks/content-box-block/content-box-block-promo';
import type { Locale } from '@/i18n/config';
import type { ContentBox } from '@/lib/strapi/types';

type ContentBoxBlockProps = {
	lang: Locale;
	block: ContentBox;
	// Names the block's region from its heading.
	id: string;
	// Off when the block shares a section with another block (the home page's Impact and About us), so it takes no wrapper of its own.
	wrapped?: boolean;
};

// A content box block from the CMS: its layout picks the variant, and its settings shape the section around it.
export default function ContentBoxBlock({ lang, block, id, wrapped = true }: ContentBoxBlockProps) {
	const content = block.layout === 'cta' ? <ContentBoxBlockCta lang={lang} block={block} id={id} /> : <ContentBoxBlockPromo lang={lang} block={block} id={id} />;

	return wrapped ? <BaseWrapper {...settingsWrapperProps(block.settings)}>{content}</BaseWrapper> : content;
}
