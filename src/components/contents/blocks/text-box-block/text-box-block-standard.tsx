import BlocksContent from '@/components/helpers/blocks-content';
import TextWithBreaks from '@/components/helpers/text-with-breaks';
import type { Locale } from '@/i18n/config';
import type { BlocksNode } from '@/lib/strapi/types';

type TextBoxBlockProps = {
	lang: Locale;
	title?: string | null;
	titleId?: string;
	// Rich text from the CMS, or a plain paragraph.
	text?: BlocksNode[] | string | null;
	// `top-border` draws a line above the block, as between consecutive text sections.
	classes?: string;
};

// A heading and rich text.
export default function TextBoxBlockStandard({ lang, title, titleId, text, classes }: TextBoxBlockProps) {
	if (!title && !text?.length) return null;

	return (
		<div className={classes ? `text-box-block standard ${classes}` : 'text-box-block standard'}>
			{title && (
				<h2 id={titleId} className="rsg-title">
					<TextWithBreaks text={title} />
				</h2>
			)}

			{typeof text === 'string' ? (
				<div className="rsg-text text">
					<p>{text}</p>
				</div>
			) : (
				text && text.length > 0 && <BlocksContent lang={lang} content={text} className="text" />
			)}
		</div>
	);
}
