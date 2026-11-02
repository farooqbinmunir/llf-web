import type { ReactNode, Ref } from 'react';
import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { FIELD_LIMITS, HONEYPOT_FIELD, type FieldError } from '@/lib/forms';

type FormLabels = Dictionary['forms'];

// The message for a field's error, in the page's language.
export function errorMessage(labels: FormLabels, field: string, error: FieldError) {
	if (error === 'emailInvalid') return labels.errors.emailInvalid;
	if (error === 'tooLong') {
		const limit = FIELD_LIMITS[field as keyof typeof FIELD_LIMITS];

		return labels.errors.tooLong.replace('{field}', labels[field as keyof typeof FIELD_LIMITS]).replace('{max}', String(limit));
	}

	return labels.errors.required[field as keyof FormLabels['errors']['required']];
}

// What ties a control to its error: marked invalid, and described by the message under it.
export const controlProps = (id: string, error: string | undefined) => ({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-error` : undefined });

type PrivacyNoticeProps = { lang: Locale; text: string; linkLabel: string };

// The line under a form that says what its details are used for, with `{link}` in the text as the privacy policy link.
export function PrivacyNotice({ lang, text, linkLabel }: PrivacyNoticeProps) {
	const [before, after] = text.split('{link}');

	return (
		<p className="rsg-form-privacy">
			{before}
			<Link href={localisedPath(lang, '/privacy-policy')}>{linkLabel}</Link>
			{after}
		</p>
	);
}

type FormFieldProps = { id: string; label: string; hint?: string; error?: string; labelClasses?: string; children: ReactNode };

// A label, its control and, when the value was rejected, the reason under it.
export function FormField({ id, label, hint, error, labelClasses = 'rsg-form-label', children }: FormFieldProps) {
	return (
		<div className="rsg-form-field">
			<label className={labelClasses} htmlFor={id}>
				{label}
				{hint && <span className="rsg-form-hint">{` ${hint}`}</span>}
			</label>

			{children}

			{error && (
				<p id={`${id}-error`} className="rsg-form-error">
					{error}
				</p>
			)}
		</div>
	);
}

type ErrorSummaryProps = { ref: Ref<HTMLDivElement>; title: string; errors: { id: string; message: string }[] };

// Lists every rejected field, each linked to its control. The form moves focus here when it comes back with errors.
export function ErrorSummary({ ref, title, errors }: ErrorSummaryProps) {
	return (
		<div ref={ref} className="rsg-error-summary" tabIndex={-1} aria-labelledby="error-summary-title">
			<h2 id="error-summary-title" className="rsg-title">
				{title}
			</h2>

			<ul role="list">
				{errors.map(({ id, message }) => (
					<li key={id}>
						<a href={`#${id}`}>{message}</a>
					</li>
				))}
			</ul>
		</div>
	);
}

// The field only bots fill in (see HONEYPOT_FIELD). It is hidden from sight and from assistive technology, and skipped by Tab.
export function Honeypot({ id, label }: { id: string; label: string }) {
	return (
		<div className="rsg-form-honeypot" aria-hidden="true">
			<label htmlFor={id}>{label}</label>
			<input id={id} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
		</div>
	);
}
