import Image from 'next/image';
import WrappedCollection from '@/components/contents/blocks/_blueprints/wrapped-collection';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockInline from '@/components/contents/blocks/content-box-block/content-box-block-inline';
import TextBoxBlockStandard from '@/components/contents/blocks/text-box-block/text-box-block-standard';
import DownloadLink from '@/components/helpers/download-link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { FundingPage } from '@/lib/data/contact';

type TemplateFundingPageProps = { lang: Locale; page: FundingPage; labels: Dictionary['contact'] };

// The Funding queries page: the label and title across the top, then the call in two columns from lg up, with the
// guidelines download under the second.
export default function TemplateFundingPage({ lang, page, labels }: TemplateFundingPageProps) {
	const { label, title, body, aside, guidelines } = page;

	return (
		<BaseWrapper wrapperClasses="section-wrapper-small" brand="yellow" colClasses="col-12 col-lg-8 offset-lg-2">
			<div className="template-funding-page">
				<WrappedCollection
					heading={{ id: 'funding-title', label, title, titleTag: 'h1' }}
					body={
						<div className="row">
							<div className="col col-12 col-lg-6">
								<TextBoxBlockStandard lang={lang} text={body} />
							</div>

							<div className="col col-12 col-lg-6">
								<TextBoxBlockStandard lang={lang} text={aside} />

								{guidelines && (
									<ContentBoxBlockInline
										titleTag="h2"
										title={guidelines.title}
										text={guidelines.text}
										media={<Image src="/images/bowls.svg" alt="" width={40} height={40} />}
									>
										<DownloadLink download={guidelines} labels={labels} />
									</ContentBoxBlockInline>
								)}
							</div>
						</div>
					}
				/>
			</div>
		</BaseWrapper>
	);
}
