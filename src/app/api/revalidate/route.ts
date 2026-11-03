import { revalidateTag } from 'next/cache';
import { matchesSecret } from '@/lib/secret';

type WebhookPayload = { event: string; model?: string; entry?: { publishedAt?: string | null } };

// Page copy (the `*-page` single types), generic pages and the global settings are read only by queries tagged with
// their own name, so a change refreshes just those. Posts, taxonomies, people, partners and media also appear inside
// other types' queries (a project's country, a story's project, the home page's featured cards), so a change to any of
// them refreshes every page.
const ownTag = (model: string) => model === 'global' || model === 'page' || model.endsWith('-page');

// Strapi's revalidation webhook (set up in the llf repo's bootstrap) calls this on every change. The cache entries are
// expired outright rather than served stale while they refresh, so an editor who publishes sees the change on the next
// load.
export async function POST(request: Request) {
	const token = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? null;
	if (!matchesSecret(token, process.env.REVALIDATE_SECRET)) return Response.json({ revalidated: false }, { status: 401 });

	const { event, model, entry } = (await request.json()) as WebhookPayload;

	// Saving a draft changes nothing visitors can see.
	if ((event === 'entry.create' || event === 'entry.update') && entry?.publishedAt === null) return Response.json({ revalidated: false });

	const tag = model && ownTag(model) ? model : 'strapi';
	revalidateTag(tag, { expire: 0 });

	return Response.json({ revalidated: true, tag });
}
