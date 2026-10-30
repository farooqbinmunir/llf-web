import type { Locale } from '@/i18n/config';

// Latin digits in every language, as the content itself uses them. Dates are stored without a time, so they are read as UTC.
const locale = (lang: Locale) => `${lang}-u-nu-latn`;

// "April 2019".
export const formatMonth = (lang: Locale, date: string) => new Intl.DateTimeFormat(locale(lang), { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));

// "April 20, 2026".
export const formatDate = (lang: Locale, date: string) => new Intl.DateTimeFormat(locale(lang), { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));

// "12MB". Strapi stores a file's size in kilobytes.
export function formatFileSize(lang: Locale, kilobytes: number) {
	const isMegabytes = kilobytes >= 1000;

	return new Intl.NumberFormat(locale(lang), {
		style: 'unit',
		unit: isMegabytes ? 'megabyte' : 'kilobyte',
		unitDisplay: 'narrow',
		maximumFractionDigits: isMegabytes ? 1 : 0,
	}).format(isMegabytes ? kilobytes / 1000 : Math.max(1, kilobytes));
}
