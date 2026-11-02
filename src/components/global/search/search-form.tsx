import Form from 'next/form';
import { localisedPath, type Locale } from '@/i18n/config';

type SearchFormProps = { lang: Locale; id: string; label: string; query?: string };

// The search box, a GET form to the Search page, so a search works before hydration and every result set has its own URL.
// `id` must be unique on the page.
export default function SearchForm({ lang, id, label, query }: SearchFormProps) {
	return (
		<Form className="rsg-search-form" role="search" action={localisedPath(lang, '/search')}>
			<label className="rsg-visually-hidden" htmlFor={id}>
				{label}
			</label>
			<input id={id} type="search" name="q" defaultValue={query} placeholder={label} maxLength={100} autoComplete="off" />
			<button className="rsg-fa" type="submit" aria-label={label} />
		</Form>
	);
}
