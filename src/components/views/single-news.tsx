import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBlocks from '@/components/contents/blocks/content-blocks';
import ListingBlockStandard from '@/components/contents/blocks/listing-block/listing-block-standard';
import NewsHeaderStandard from '@/components/contents/post-types/header-contents/news/news-standard';
import NewsTileList from '@/components/contents/post-types/tiles/news/news-list';
import { localisedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { NewsCard, NewsDetail } from '@/lib/data/news';

type SingleNewsProps = { lang: Locale; news: NewsDetail; related: NewsCard[]; dictionary: Dictionary };

// A news page: the header in a centred column, the body built from blocks, then more news as rows in the same column.
export default function SingleNews({ lang, news, related, dictionary }: SingleNewsProps) {
	return (
		<>
			<article className="single-article-content">
				<div className="container-xxl">
					<div className="row">
						<div className="col col-12 col-lg-8 offset-lg-2">
							<NewsHeaderStandard lang={lang} news={news} labels={dictionary.story} />
						</div>
					</div>
				</div>

				<div className="rsg-article-body">
					<ContentBlocks lang={lang} sections={news.body} />
				</div>
			</article>

			{related.length > 0 && (
				<BaseWrapper wrapperClasses="section-wrapper-small section-rounded-top" brand="light" colClasses="col-12 col-lg-8 offset-lg-2">
					<ListingBlockStandard
						heading={{ id: 'more-news-title', label: dictionary.news.moreNews }}
						viewAll={{ label: dictionary.news.viewAllNews, href: localisedPath(lang, '/news') }}
						classes="center-aligned"
						tiles={related.map((item) => ({ key: item.documentId, tile: <NewsTileList lang={lang} news={item} /> }))}
					/>
				</BaseWrapper>
			)}
		</>
	);
}
