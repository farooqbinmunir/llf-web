import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import SearchForm from '@/components/global/search/search-form';
import SearchQuickLinks from '@/components/global/search/search-quick-links';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { SearchPage } from '@/lib/data/search';

type PageNotFoundProps = { lang: Locale; labels: Dictionary['notFound']; searchLabel: string; searchPage: SearchPage | null };

// The 404 page, as the LLF rebuild's: the heading and message, then the Search page's box, intro and quick links, so it
// shares the search page's styles.
export default function PageNotFound({ lang, labels, searchLabel, searchPage }: PageNotFoundProps) {
	return (
		<BaseWrapper colClasses="col-12 col-lg-8 offset-lg-2">
			<div className="search-page page-not-found">
				<title>{labels.title}</title>

				<h1 className="rsg-title">{labels.title}</h1>
				<p className="page-not-found-message">{labels.text}</p>

				<SearchForm lang={lang} id="not-found-search-input" label={searchLabel} />

				{searchPage?.intro && <p className="rsg-search-message">{searchPage.intro}</p>}

				<SearchQuickLinks lang={lang} links={searchPage?.quickLinks ?? []} />
			</div>
		</BaseWrapper>
	);
}
