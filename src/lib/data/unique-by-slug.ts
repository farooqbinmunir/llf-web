// Keeps the first entry for each slug, so a list merged from several queries keeps the priority order it was built in.
export function uniqueBySlug<T extends { slug: string }>(items: (T | null)[]) {
	const seen = new Set<string>();

	return items.filter((item): item is T => {
		if (item === null || seen.has(item.slug)) return false;

		seen.add(item.slug);
		return true;
	});
}
