'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { ErrorSummary, FormField, Honeypot, PrivacyNotice, controlProps, errorMessage } from '@/components/global/forms/form-parts';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { sendEnquiry } from '@/lib/actions/forms';
import { ENQUIRY_TOPICS, FIELD_LIMITS, initialFormState, type EnquiryField, type EnquiryTopic, type FormState } from '@/lib/forms';

type FormEnquiryProps = {
	lang: Locale;
	// The topic the visitor came for, from the Contact card they followed.
	topic: EnquiryTopic;
	success: { title: string | null; text: string | null };
	labels: Dictionary['forms'];
	backLabel: string;
};

// The order fields are checked and listed in the error summary, which is their order in the form.
const FIELDS: EnquiryField[] = ['name', 'email', 'organisation', 'topic', 'message'];

// The enquiry form. The Server Action checks every field and stores the message in Strapi; the form comes back with
// an error summary and inline errors, or is replaced by the confirmation. Focus follows, so screen readers hear the outcome.
// Without JavaScript the form still posts and the page renders the same outcome.
export default function FormEnquiry({ lang, topic, success, labels, backLabel }: FormEnquiryProps) {
	const [state, formAction, isPending] = useActionState<FormState<EnquiryField>, FormData>(sendEnquiry, initialFormState);
	const summaryRef = useRef<HTMLDivElement>(null);
	const successRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (state.status === 'invalid') summaryRef.current?.focus();
		if (state.status === 'sent') successRef.current?.focus();
	}, [state]);

	if (state.status === 'sent') {
		return (
			<div ref={successRef} className="rsg-form-enquiry rsg-surface-light-4 is-sent" tabIndex={-1} aria-labelledby="enquiry-sent-title">
				<h2 id="enquiry-sent-title" className="rsg-title">
					{success.title}
				</h2>
				{success.text && <p className="rsg-text">{success.text}</p>}
				<Link className="rsg-button" href={localisedPath(lang, '/contact')}>
					{backLabel}
				</Link>
			</div>
		);
	}

	const error = (field: EnquiryField) => {
		const fieldError = state.errors[field];

		return fieldError && errorMessage(labels, field, fieldError);
	};
	const summary = FIELDS.flatMap((field) => {
		const message = error(field);

		return message ? [{ id: `enquiry-${field}`, message }] : [];
	});

	return (
		<form className="rsg-form-enquiry rsg-surface-light-4" action={formAction} noValidate>
			{summary.length > 0 && <ErrorSummary ref={summaryRef} title={labels.errorSummary} errors={summary} />}

			<input type="hidden" name="lang" value={lang} />

			<div className="rsg-form-fields">
				<FormField id="enquiry-name" label={labels.name} error={error('name')}>
					<input
						{...controlProps('enquiry-name', error('name'))}
						className="rsg-form-control"
						type="text"
						name="name"
						autoComplete="name"
						maxLength={FIELD_LIMITS.name}
						required
						defaultValue={state.values.name}
					/>
				</FormField>

				<FormField id="enquiry-email" label={labels.email} error={error('email')}>
					<input
						{...controlProps('enquiry-email', error('email'))}
						className="rsg-form-control"
						type="email"
						name="email"
						autoComplete="email"
						maxLength={FIELD_LIMITS.email}
						required
						defaultValue={state.values.email}
					/>
				</FormField>

				<FormField id="enquiry-organisation" label={labels.organisation} hint={labels.optional} error={error('organisation')}>
					<input
						{...controlProps('enquiry-organisation', error('organisation'))}
						className="rsg-form-control"
						type="text"
						name="organisation"
						autoComplete="organization"
						maxLength={FIELD_LIMITS.organisation}
						defaultValue={state.values.organisation}
					/>
				</FormField>

				<FormField id="enquiry-topic" label={labels.topic} error={error('topic')}>
					<div className="rsg-form-select">
						<select {...controlProps('enquiry-topic', error('topic'))} className="rsg-form-control" name="topic" required defaultValue={state.values.topic ?? topic}>
							{ENQUIRY_TOPICS.map((value) => (
								<option key={value} value={value}>
									{labels.topics[value]}
								</option>
							))}
						</select>
					</div>
				</FormField>

				<FormField id="enquiry-message" label={labels.message} error={error('message')}>
					<textarea
						{...controlProps('enquiry-message', error('message'))}
						className="rsg-form-control"
						name="message"
						rows={8}
						maxLength={FIELD_LIMITS.message}
						required
						defaultValue={state.values.message}
					/>
				</FormField>
			</div>

			<Honeypot id="enquiry-website" label={labels.honeypot} />

			<PrivacyNotice lang={lang} text={labels.privacy.enquiry} linkLabel={labels.privacy.link} />

			<div className="rsg-form-buttons">
				{/* Disabled while sending, so a second press cannot send the message twice. Focus then moves to the outcome. */}
				<button className="rsg-button rsg-fa message" type="submit" disabled={isPending}>
					{isPending ? labels.sending : labels.send}
				</button>

				{state.status === 'failed' && (
					<p className="rsg-form-error" role="alert">
						{labels.failed}
					</p>
				)}
			</div>
		</form>
	);
}
