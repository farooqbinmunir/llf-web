import { lang as rootLang } from 'next/root-params';
import PageNotFound from '@/components/views/page-not-found';
import { defaultLocale, hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getSearchPage } from '@/lib/data/search';

// Shown for any unknown address under a language and wherever a page calls notFound(). A not-found file receives no
// props, so the language comes from the root params.
export default async function NotFound() {
	const requested = await rootLang();
	const lang = hasLocale(requested) ? requested : defaultLocale;
	const [dictionary, searchPage] = await Promise.all([getDictionary(lang), getSearchPage(lang)]);

	return <PageNotFound lang={lang} labels={dictionary.notFound} searchLabel={dictionary.search.label} searchPage={searchPage} />;
}
