'use server';

import { draftMode, headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Leaves draft mode and reloads the page the editor was on, now showing what is published. Only the referring page's
// path is kept, so the redirect stays on this site.
export async function exitPreview() {
	(await draftMode()).disable();

	const referer = (await headers()).get('referer');

	redirect(referer ? new URL(referer).pathname : '/');
}
