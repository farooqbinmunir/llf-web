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

type SearchFiltersProps = {
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
export default function SearchFilters({ id, action, label, resetLabel, applyLabel, resetHref, fields, hiddenFields = {} }: SearchFiltersProps) {
	const controlsId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useBreakpointUp('lg');

	return (
		<Form id={id} className={`search-filters${isOpen ? ' is-open' : ''}`} action={action} scroll={false}>
			{isDesktop ? (
				<p className="label">{label}</p>
			) : (
				<button className="label toggle" type="button" aria-expanded={isOpen} aria-controls={controlsId} onClick={() => setIsOpen(!isOpen)}>
					{label}
				</button>
			)}

			<div id={controlsId} className="controls">
				{Object.entries(hiddenFields).map(([name, value]) => (
					<input key={name} type="hidden" name={name} value={value} />
				))}

				{fields.map((field) => (
					<div key={field.name} className="field">
						<label className="rsg-visually-hidden" htmlFor={`${id}-${field.name}`}>
							{field.label}
						</label>
						{/* "All" submits an empty value, which the listing reads as no filter. */}
						<select id={`${id}-${field.name}`} className="select" name={field.name} autoComplete="off" defaultValue={field.value ?? ''}>
							<option value="">{field.allLabel}</option>
							{field.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				))}

				<div className="buttons">
					<Link className="reset" href={resetHref} scroll={false}>
						{resetLabel}
					</Link>
					<button className="submit" type="submit">
						{applyLabel}
					</button>
				</div>
			</div>
		</Form>
	);
}
