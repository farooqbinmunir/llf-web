import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { hasLocale } from '@/i18n/config';
import { matchesSecret } from '@/lib/secret';

// Strapi's Preview button opens this with the page's path and the version the editor is looking at. The draft version
// turns on draft mode, a cookie that makes every Strapi read fetch drafts for this browser only; the published version
// turns it off, so the editor sees what visitors see.
export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	if (!matchesSecret(searchParams.get('secret'), process.env.PREVIEW_SECRET)) return new Response('Invalid preview link', { status: 401 });

	// Only a page of this site, so a preview link cannot send the editor anywhere else.
	const path = searchParams.get('path') ?? '';
	if (!path.startsWith('/') || !hasLocale(path.split('/')[1])) return new Response('Invalid preview path', { status: 400 });

	const draft = await draftMode();
	if (searchParams.get('status') === 'published') draft.disable();
	else draft.enable();

	redirect(path);
}
