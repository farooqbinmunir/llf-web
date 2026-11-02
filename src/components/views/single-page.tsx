import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import TextBoxBlockStandard from '@/components/contents/blocks/text-box-block/text-box-block-standard';
import HeaderContentsSingle from '@/components/contents/post-types/header-contents/_blueprints/single';
import type { Locale } from '@/i18n/config';
import type { Page } from '@/lib/data/pages';

type SinglePageProps = { lang: Locale; page: Page };

// A generic page (privacy policy, terms of use, accessibility, careers, LLF Hub): the plain header band the listing pages
// open with, then the text at a reading measure.
export default function SinglePage({ lang, page }: SinglePageProps) {
	return (
		<>
			<HeaderContentsSingle hero={{ eyebrow: null, title: page.title, text: page.intro, image: null }} layout="colour" />

			<BaseWrapper colClasses="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
				<TextBoxBlockStandard lang={lang} text={page.body} />
			</BaseWrapper>
		</>
	);
}
