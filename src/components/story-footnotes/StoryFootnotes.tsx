import BlocksContent from '@/components/blocks-content/BlocksContent';
import type { Locale } from '@/i18n/config';
import type { BlocksNode } from '@/lib/strapi/types';

type StoryFootnotesProps = { lang: Locale; label: string; content: BlocksNode[] };

// Sources the story's text points to with superscript numbers, in small type under a short rule.
export default function StoryFootnotes({ lang, label, content }: StoryFootnotesProps) {
	return (
		<aside className="story-footnotes container-xxl" aria-label={label}>
			<BlocksContent lang={lang} content={content} className="notes" />
		</aside>
	);
}
