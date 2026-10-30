'use client';

import { useId, useState } from 'react';
import Form from 'next/form';
import Link from 'next/link';
import useBreakpointUp from '@/hooks/useBreakpointUp';

// `select` is a dropdown; `radio-lozenge` is a row of single-choice pills, such as the programme phase tabs.
export type FilterField = {
	name: string;
	label: string;
	render: 'select' | 'radio-lozenge';
	options: { value: string; label: string }[];
	value?: string;
	// The "All …" option of a select, which submits an empty value.
	allLabel?: string;
};

type SearchFiltersProps = {
	id: string;
	action: string;
	label: string;
	fields: FilterField[];
	// Carried through a submission unchanged, such as the filters a phase pill keeps.
	hiddenFields?: Record<string, string | undefined>;
	reset?: { label: string; href: string };
	applyLabel?: string;
	// Shows the label before a pills-only bar, as the Library's "Filter by type".
	showLabel?: boolean;
	className?: string;
};

// A GET form, so filtering works before hydration and every result set has a shareable URL. Below the lg breakpoint the
// fields collapse behind a toggle; as with the footer, CSS decides visibility and the script only swaps the toggle out.
// A pills-only bar (every field a lozenge) applies on click, so it needs no toggle, Reset or Apply; its label is only shown on request.
// Callers should key it on the current filters, so its uncontrolled fields reset whenever the URL changes.
export default function SearchFilters({ id, action, label, fields, hiddenFields = {}, reset, applyLabel, showLabel, className }: SearchFiltersProps) {
	const controlsId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useBreakpointUp('lg');
	const isPillsOnly = fields.every((field) => field.render === 'radio-lozenge');
	const classes = ['rsg-search-filters', isPillsOnly && 'pills-only', isOpen && 'is-open', className].filter(Boolean).join(' ');

	return (
		<Form id={id} className={classes} action={action} scroll={false} aria-label={isPillsOnly ? label : undefined}>
			{/* The form is already named by the label, so the shown copy is hidden from screen readers. */}
			{isPillsOnly && showLabel && (
				<p className="rsg-filters-toggle rsg-fa" aria-hidden="true">
					{label}
				</p>
			)}

			{!isPillsOnly &&
				(isDesktop ? (
					<p className="rsg-filters-toggle rsg-fa">{label}</p>
				) : (
					<button className="rsg-filters-toggle rsg-fa" type="button" aria-expanded={isOpen} aria-controls={controlsId} onClick={() => setIsOpen(!isOpen)}>
						{label}
					</button>
				))}

			<div id={controlsId} className="rsg-filters-controls">
				{Object.entries(hiddenFields).map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />)}

				{fields.map((field) =>
					field.render === 'select' ? (
						<div key={field.name} className="rsg-filter-fieldset rsg-fa select">
							<label className="rsg-visually-hidden" htmlFor={`${id}-${field.name}`}>
								{field.label}
							</label>
							{/* "All" submits an empty value, which the listing reads as no filter. */}
							<select id={`${id}-${field.name}`} name={field.name} autoComplete="off" defaultValue={field.value ?? ''}>
								<option value="">{field.allLabel}</option>
								{field.options.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					) : (
						<fieldset key={field.name} className="rsg-filter-fieldset radio-lozenge">
							<legend className="rsg-visually-hidden">{field.label}</legend>
							{field.options.map((option) => (
								<label key={option.value} className="rsg-filters-label">
									<input
										className="rsg-filters-checkbox rsg-visually-hidden"
										type="radio"
										name={field.name}
										value={option.value}
										defaultChecked={option.value === field.value}
										onChange={(event) => event.currentTarget.form?.requestSubmit()}
									/>
									<span className="rsg-filters-checkbox-text">{option.label}</span>
								</label>
							))}
						</fieldset>
					),
				)}

				{!isPillsOnly && (
					<div className="rsg-form-buttons">
						{reset && (
							<Link className="rsg-filters-reset rsg-fa" href={reset.href} scroll={false}>
								{reset.label}
							</Link>
						)}
						<button className="rsg-filter-submit rsg-cta-apply rsg-fa" type="submit">
							{applyLabel}
						</button>
					</div>
				)}
			</div>
		</Form>
	);
}
