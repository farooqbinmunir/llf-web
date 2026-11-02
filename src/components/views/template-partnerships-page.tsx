import Image from 'next/image';
import Link from 'next/link';
import WrappedCollection from '@/components/contents/blocks/_blueprints/wrapped-collection';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import TextBoxBlockStandard from '@/components/contents/blocks/text-box-block/text-box-block-standard';
import BlocksContent from '@/components/helpers/blocks-content';
import { resolveHref, type Locale } from '@/i18n/config';
import type { PartnershipsPage } from '@/lib/data/contact';

type TemplatePartnershipsPageProps = { lang: Locale; page: PartnershipsPage };

// The Partnerships page: the invitation (title, lead and text) beside why to partner with the LLF, then the link to
// discuss a partnership over the LLF's two half-circles, which run into the foot of the section.
export default function TemplatePartnershipsPage({ lang, page }: TemplatePartnershipsPageProps) {
	const { title, lead, body, whyTitle, why, linkLabel, linkUrl } = page;

	return (
		<BaseWrapper wrapperClasses="section-wrapper-small" brand="yellow" colClasses="col-12 col-lg-8 offset-lg-2">
			<div className="template-partnerships-page">
				<div className="row">
					<div className="col col-12 col-lg-6">
						<WrappedCollection heading={{ id: 'partnerships-title', title, text: lead, titleTag: 'h1' }} body={body && <BlocksContent lang={lang} content={body} className="rsg-text" />} />
					</div>

					<div className="col col-12 col-lg-6">
						<TextBoxBlockStandard lang={lang} title={whyTitle} text={why} />

						<div className="rsg-cta">
							{linkLabel && linkUrl && (
								<Link className="rsg-button rsg-fa message" href={resolveHref(lang, linkUrl)}>
									{linkLabel}
								</Link>
							)}

							<div className="rsg-media-wrapper" aria-hidden="true">
								<Image src="/images/bowls.svg" alt="" width={540} height={540} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</BaseWrapper>
	);
}
