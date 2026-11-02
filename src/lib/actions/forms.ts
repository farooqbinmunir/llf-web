'use server';

import { hasLocale } from '@/i18n/config';
import { FIELD_LIMITS, HONEYPOT_FIELD, isEnquiryTopic, type EnquiryField, type FieldError, type FormState, type NewsletterField } from '@/lib/forms';
import { strapiCreate } from '@/lib/strapi/client';

// A practical check of the address's shape; the reply itself is the real test.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const read = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();

function checkText(value: string, limit: number, required: boolean): FieldError | undefined {
	if (required && !value) return 'required';
	if (value.length > limit) return 'tooLong';
}

function checkEmail(value: string): FieldError | undefined {
	return checkText(value, FIELD_LIMITS.email, true) ?? (EMAIL_PATTERN.test(value) ? undefined : 'emailInvalid');
}

const hasErrors = (errors: object) => Object.values(errors).some(Boolean);

// A filled-in honeypot is a bot. It is told the form was sent, so it has no reason to try again.
const isBot = (formData: FormData) => read(formData, HONEYPOT_FIELD) !== '';

const language = (formData: FormData) => {
	const lang = read(formData, 'lang');

	return hasLocale(lang) ? lang : 'en';
};

export async function sendEnquiry(_previous: FormState<EnquiryField>, formData: FormData): Promise<FormState<EnquiryField>> {
	const values = {
		name: read(formData, 'name'),
		email: read(formData, 'email').toLowerCase(),
		organisation: read(formData, 'organisation'),
		topic: read(formData, 'topic'),
		message: read(formData, 'message'),
	};

	if (isBot(formData)) return { status: 'sent', errors: {}, values: {} };

	const errors = {
		name: checkText(values.name, FIELD_LIMITS.name, true),
		email: checkEmail(values.email),
		organisation: checkText(values.organisation, FIELD_LIMITS.organisation, false),
		topic: isEnquiryTopic(values.topic) ? undefined : ('required' as const),
		message: checkText(values.message, FIELD_LIMITS.message, true),
	};

	if (hasErrors(errors)) return { status: 'invalid', errors, values };

	const response = await strapiCreate('/enquiries', { ...values, language: language(formData) }).catch(() => null);

	return response?.ok ? { status: 'sent', errors: {}, values: {} } : { status: 'failed', errors: {}, values };
}

export async function subscribe(_previous: FormState<NewsletterField>, formData: FormData): Promise<FormState<NewsletterField>> {
	const email = read(formData, 'email').toLowerCase();

	if (isBot(formData)) return { status: 'sent', errors: {}, values: {} };

	const error = checkEmail(email);
	if (error) return { status: 'invalid', errors: { email: error }, values: { email } };

	const response = await strapiCreate('/newsletter-subscribers', { email, language: language(formData) }).catch(() => null);
	// An address that is already subscribed fails Strapi's unique check. Treating it as a success keeps the list private:
	// nobody can find out whether an address is on it.
	const alreadySubscribed = response?.status === 400 && (await response.json().catch(() => null))?.error?.details?.errors?.some((detail: { path: string[] }) => detail.path[0] === 'email');

	return response?.ok || alreadySubscribed ? { status: 'sent', errors: {}, values: {} } : { status: 'failed', errors: {}, values: { email } };
}
