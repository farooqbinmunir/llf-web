'use client';

import { useId, useState } from 'react';
import Form from 'next/form';
import Link from 'next/link';
import useBreakpointUp from '@/hooks/useBreakpointUp';

export type FilterField = {
	name: string;
	label: string;
	allLabel: string;
	value?: string;
	options: { value: string; label: string }[];
};

type FilterBarProps = {
	id: string;
	action: string;
	label: string;
	resetLabel: string;
	applyLabel: string;
	resetHref: string;
	fields: FilterField[];
	// Carried through a submission unchanged, such as the selected programme phase.
	hiddenFields?: Record<string, string>;
};

// A GET form, so filtering works before hydration and every result set has a shareable URL. Below the lg breakpoint the
// fields collapse behind a toggle; as with the footer, CSS decides visibility and the script only swaps the toggle out.
// Callers should key it on the current filters, so its uncontrolled selects reset whenever the URL changes.
export default function FilterBar({ id, action, label, resetLabel, applyLabel, resetHref, fields, hiddenFields = {} }: FilterBarProps) {
	const fieldsId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useBreakpointUp('lg');

	return (
		<Form id={id} className="rsg-filter-bar" action={action} data-open={isOpen || undefined} scroll={false}>
			{isDesktop ? (
				<p className="rsg-filter-bar__label">{label}</p>
			) : (
				<button className="rsg-filter-bar__label rsg-filter-bar__toggle" type="button" aria-expanded={isOpen} aria-controls={fieldsId} onClick={() => setIsOpen(!isOpen)}>
					{label}
				</button>
			)}

			<div id={fieldsId} className="rsg-filter-bar__fields">
				{Object.entries(hiddenFields).map(([name, value]) => (
					<input key={name} type="hidden" name={name} value={value} />
				))}

				{fields.map((field) => (
					<div key={field.name} className="rsg-filter-bar__field">
						<label className="rsg-visually-hidden" htmlFor={`${id}-${field.name}`}>
							{field.label}
						</label>
						{/* "All" submits an empty value, which the listing reads as no filter. */}
						<select id={`${id}-${field.name}`} className="rsg-filter-bar__select" name={field.name} autoComplete="off" defaultValue={field.value ?? ''}>
							<option value="">{field.allLabel}</option>
							{field.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				))}

				<div className="rsg-filter-bar__actions">
					<Link className="rsg-filter-bar__reset" href={resetHref} scroll={false}>
						{resetLabel}
					</Link>
					<button className="rsg-filter-bar__apply" type="submit">
						{applyLabel}
					</button>
				</div>
			</div>
		</Form>
	);
}
