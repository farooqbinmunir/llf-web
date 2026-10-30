// Must match the Strapi locales (en default, fr, ar) so every route can request content in its own language.
export const locales = ['en', 'fr', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Labels are each language's own name, as the language switcher shows them.
export const localeDetails: Record<Locale, { label: string; dir: 'ltr' | 'rtl' }> = {
	en: { label: 'English', dir: 'ltr' },
	fr: { label: 'Français', dir: 'ltr' },
	ar: { label: 'عربي', dir: 'rtl' },
};

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

export const localisedPath = (lang: Locale, path: string) => `/${lang}${path === '/' ? '' : path}`;

// Editors enter site paths without a language ("/partnerships"), so the same entry works in every locale; full URLs pass through.
export const resolveHref = (lang: Locale, url: string) => (url.startsWith('/') ? localisedPath(lang, url) : url);
