'use client';

import { useActionState, useEffect, useRef } from 'react';
import { FormField, Honeypot, PrivacyNotice, controlProps, errorMessage } from '@/components/global/forms/form-parts';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { subscribe } from '@/lib/actions/forms';
import { FIELD_LIMITS, initialFormState, type FormState, type NewsletterField } from '@/lib/forms';

type FormNewsletterProps = { lang: Locale; successText: string | null; labels: Dictionary['forms'] };

// The newsletter sign-up: one email field. A rejected address comes back with its error and takes focus again; once
// subscribed, the form gives way to the confirmation, which the status region announces.
export default function FormNewsletter({ lang, successText, labels }: FormNewsletterProps) {
	const [state, formAction, isPending] = useActionState<FormState<NewsletterField>, FormData>(subscribe, initialFormState);
	const inputRef = useRef<HTMLInputElement>(null);
	const error = state.errors.email && errorMessage(labels, 'email', state.errors.email);

	useEffect(() => {
		if (state.status === 'invalid') inputRef.current?.focus();
	}, [state]);

	return (
		<div className="rsg-form-newsletter">
			<p className="rsg-form-status rsg-text" role="status">
				{state.status === 'sent' && successText}
			</p>

			{state.status !== 'sent' && (
				<form action={formAction} noValidate>
					<input type="hidden" name="lang" value={lang} />

					<FormField id="newsletter-email" label={labels.newsletterEmail} labelClasses="rsg-visually-hidden" error={error}>
						<input
							{...controlProps('newsletter-email', error)}
							ref={inputRef}
							className="rsg-form-control"
							type="email"
							name="email"
							autoComplete="email"
							placeholder={labels.newsletterPlaceholder}
							maxLength={FIELD_LIMITS.email}
							required
							defaultValue={state.values.email}
						/>
					</FormField>

					<Honeypot id="newsletter-website" label={labels.honeypot} />

					<PrivacyNotice lang={lang} text={labels.privacy.newsletter} linkLabel={labels.privacy.link} />

					<div className="rsg-form-buttons">
						{state.status === 'failed' && (
							<p className="rsg-form-error" role="alert">
								{labels.subscribeFailed}
							</p>
						)}

						<button className="rsg-subscribe" type="submit" disabled={isPending}>
							{isPending ? labels.subscribing : labels.subscribe}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
