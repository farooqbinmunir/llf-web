'use client';

import { useState, type ReactNode } from 'react';
import AccordionItem from '@/components/contents/blocks/_blueprints/accordion-item';
import type { Palette } from '@/components/contents/blocks/base-wrapper';

type AccordionProps = {
	id: string;
	items: { key: string; title: ReactNode; body: ReactNode }[];
	palette: Palette;
	openFirst?: boolean;
};

// A list of accordion items of which one is open at a time; opening another closes it, and its own button closes it too.
export default function Accordion({ id, items, palette, openFirst = false }: AccordionProps) {
	const [openKey, setOpenKey] = useState(openFirst ? items[0]?.key : undefined);

	return (
		<ul className="rsg-accordion" role="list">
			{items.map((item, index) => (
				<li key={item.key}>
					<AccordionItem
						id={`${id}-${index + 1}`}
						title={item.title}
						body={item.body}
						isOpen={openKey === item.key}
						onToggle={() => setOpenKey(openKey === item.key ? undefined : item.key)}
						palette={palette}
					/>
				</li>
			))}
		</ul>
	);
}
