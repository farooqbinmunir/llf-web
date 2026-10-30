import type { ReactNode } from 'react';
import type { Palette } from '@/components/contents/blocks/base-wrapper';

type AccordionItemProps = {
	id: string;
	title: ReactNode;
	body: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	// The item takes tone 4 (card) of the palette of the section it sits in.
	palette: Palette;
};

// One row of an accordion: a heading whose button opens the panel below it. The closed panel is hidden from assistive
// technology and the tab order by `visibility`, which waits for the collapse to finish.
export default function AccordionItem({ id, title, body, isOpen, onToggle, palette }: AccordionItemProps) {
	return (
		<div className={`accordion-item rsg-surface-${palette}-4`}>
			<h3 className="accordion-header">
				<button id={`${id}-button`} className="accordion-button" type="button" aria-expanded={isOpen} aria-controls={id} onClick={onToggle}>
					{title}
					<span className="accordion-icon" aria-hidden="true" />
				</button>
			</h3>

			<div id={id} className={isOpen ? 'accordion-collapse is-open' : 'accordion-collapse'} role="region" aria-labelledby={`${id}-button`}>
				<div className="accordion-body">{body}</div>
			</div>
		</div>
	);
}
