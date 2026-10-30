import type { ReactNode } from 'react';
import Link from 'next/link';
import { resolveHref, type Locale } from '@/i18n/config';
import type { BlocksInline, BlocksList, BlocksNode, BlocksText } from '@/lib/strapi/types';

type BlocksContentProps = { lang: Locale; content: BlocksNode[]; className?: string };

function renderText(node: BlocksText, key: number) {
	let content: ReactNode = node.text;

	if (node.code) content = <code>{content}</code>;
	if (node.bold) content = <strong>{content}</strong>;
	if (node.italic) content = <em>{content}</em>;
	if (node.underline) content = <u>{content}</u>;
	if (node.strikethrough) content = <s>{content}</s>;

	return <span key={key}>{content}</span>;
}

function renderInline(lang: Locale, nodes: BlocksInline[]) {
	return nodes.map((node, index) =>
		node.type === 'link' ? (
			<Link key={index} href={resolveHref(lang, node.url)}>
				{node.children.map(renderText)}
			</Link>
		) : (
			renderText(node, index)
		),
	);
}

function renderList(lang: Locale, list: BlocksList, key: number): ReactNode {
	const Tag = list.format === 'ordered' ? 'ol' : 'ul';
	const items: { content: BlocksInline[]; nested: BlocksList[] }[] = [];

	// Strapi stores an indented list as a sibling of the items, so it joins the item before it, as valid HTML requires.
	list.children.forEach((child) => {
		if (child.type === 'list' && items.length > 0) items[items.length - 1].nested.push(child);
		else items.push(child.type === 'list' ? { content: [], nested: [child] } : { content: child.children, nested: [] });
	});

	return (
		<Tag key={key}>
			{items.map((item, index) => (
				<li key={index}>
					{renderInline(lang, item.content)}
					{item.nested.map((nested, nestedIndex) => renderList(lang, nested, nestedIndex))}
				</li>
			))}
		</Tag>
	);
}

// Renders Strapi blocks (rich text) as plain semantic HTML inside the shared `rsg-text` styles.
export default function BlocksContent({ lang, content, className }: BlocksContentProps) {
	return (
		<div className={className ? `rsg-text ${className}` : 'rsg-text'}>
			{content.map((node, index) => {
				switch (node.type) {
					case 'paragraph':
						return <p key={index}>{renderInline(lang, node.children)}</p>;
					case 'heading': {
						const Heading = `h${node.level}` as const;
						return <Heading key={index}>{renderInline(lang, node.children)}</Heading>;
					}
					case 'quote':
						return <blockquote key={index}>{renderInline(lang, node.children)}</blockquote>;
					case 'code':
						return (
							<pre key={index}>
								<code>{node.children.map((child) => child.text).join('')}</code>
							</pre>
						);
					case 'list':
						return renderList(lang, node, index);
					default:
						return null;
				}
			})}
		</div>
	);
}
