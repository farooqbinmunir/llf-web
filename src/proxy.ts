import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, hasLocale, locales } from '@/i18n/config';

// Picks the first supported language from Accept-Language (e.g. "fr-FR,fr;q=0.9,en;q=0.8" gives "fr").
function preferredLocale(request: NextRequest) {
	const header = request.headers.get('accept-language') ?? '';
	const preferred = header.split(',').map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());

	return preferred.find(hasLocale) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasLocalePrefix = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

	if (hasLocalePrefix) return;

	request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;

	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	// Skips Next internals and any request for a file (icon.svg, fonts, images).
	matcher: ['/((?!_next|.*\\..*).*)'],
};
