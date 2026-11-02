// What the enquiry and newsletter forms share with their Server Actions (lib/actions/forms.ts), which may only export
// async functions.

// The enquiry topics, as the Strapi enquiry's `topic` field lists them. Each Contact card links to the form with its topic.
export const ENQUIRY_TOPICS = ['general', 'financing', 'media', 'partnership'] as const;

export type EnquiryTopic = (typeof ENQUIRY_TOPICS)[number];

export const isEnquiryTopic = (value: string | undefined): value is EnquiryTopic => (ENQUIRY_TOPICS as readonly (string | undefined)[]).includes(value);

// The longest value each field takes, matching the Strapi schema, so the inputs and the server check agree.
export const FIELD_LIMITS = { name: 200, email: 254, organisation: 200, message: 5000 } as const;

// Names a dictionary entry under `forms.errors`, so the form shows the message in the page's language.
export type FieldError = 'required' | 'emailInvalid' | 'tooLong';

export type FormState<Field extends string> = {
	status: 'idle' | 'invalid' | 'failed' | 'sent';
	errors: Partial<Record<Field, FieldError>>;
	// What the visitor typed, so the form keeps it when it comes back with errors.
	values: Partial<Record<Field, string>>;
};

export type EnquiryField = 'name' | 'email' | 'organisation' | 'topic' | 'message';
export type NewsletterField = 'email';

export const initialFormState = { status: 'idle', errors: {}, values: {} } as const;

// A field no person sees or fills in. Bots that fill every field give themselves away.
export const HONEYPOT_FIELD = 'website';
