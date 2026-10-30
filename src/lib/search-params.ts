export type SearchParams = Record<string, string | string[] | undefined>;

// A repeated parameter keeps its first value, and an empty one (an "All …" option) counts as absent.
export const readParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) || undefined;

// Builds a link that keeps only the parameters that have a value.
export function withQuery(path: string, params: Record<string, string | number | undefined>) {
	const query = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== '') query.set(key, String(value));
	});

	const search = query.toString();

	return search ? `${path}?${search}` : path;
}
