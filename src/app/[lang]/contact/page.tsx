import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import ContentBoxBlockInline from '@/components/contents/blocks/content-box-block/content-box-block-inline';
import GroupedContentBlockStandard from '@/components/contents/blocks/grouped-content-block/grouped-content-block-standard';
import FormNewsletter from '@/components/global/forms/form-newsletter';
import SocialNavigation from '@/components/global/navigation/social-navigation/social-navigation';
import DownloadLink from '@/components/helpers/download-link';
import { hasLocale, resolveHref } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getContactPage } from '@/lib/data/contact';
import { pageMetadata } from '@/lib/metadata';

// The cards sit in the middle two-thirds of the page, as in the design; Follow LLF and Stay informed share a row from md up.
const NARROW_COLUMN = 'col-12 col-lg-8 offset-lg-2';
const HALF_COLUMN = 'col-12 col-md-6';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getContactPage(lang);

	return pageMetadata(lang, { path: '/contact', seo: page?.seo, title: page?.title, description: page?.intro });
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getContactPage(lang), getDictionary(lang)]);
	if (!page) notFound();

	const channels = page.channels.map((channel) => ({
		key: String(channel.id),
		content: (
			<ContentBoxBlockInline title={channel.title} text={channel.text} surface="rsg-surface-light-4" classes="boxed">
				{((channel.linkLabel && channel.linkUrl) || channel.download) && (
					<div className="rsg-link-list">
						{channel.linkLabel && channel.linkUrl && (
							<Link className="rsg-button rsg-fa message" href={resolveHref(lang, channel.linkUrl)}>
								{channel.linkLabel}
							</Link>
						)}
						{channel.download && <DownloadLink download={channel.download} labels={dictionary.contact} withTitle />}
					</div>
				)}
			</ContentBoxBlockInline>
		),
	}));

	const follow = page.followTitle && {
		key: 'follow',
		id: 'follow',
		colClasses: HALF_COLUMN,
		content: (
			<ContentBoxBlockInline title={page.followTitle} icon="share" surface="rsg-surface-light-4" classes="boxed">
				<SocialNavigation label={dictionary.a11y.socialNavigation} withLabels />
			</ContentBoxBlockInline>
		),
	};

	const newsletter = page.newsletter && {
		key: 'newsletter',
		id: 'newsletter',
		colClasses: HALF_COLUMN,
		content: (
			<ContentBoxBlockInline title={page.newsletter.title} icon="bell" text={page.newsletter.text} surface="rsg-surface-dark" classes="boxed">
				<FormNewsletter lang={lang} successText={page.newsletter.successText} labels={dictionary.forms} />
			</ContentBoxBlockInline>
		),
	};

	return (
		<BaseWrapper wrapperClasses="section-wrapper-small" brand="light" colClasses={NARROW_COLUMN}>
			<GroupedContentBlockStandard
				heading={{ id: 'contact-title', title: page.title, text: page.intro, titleTag: 'h1' }}
				classes="center-aligned boxed-items"
				colClasses="col-12"
				items={[...channels, ...[follow, newsletter].filter((item) => !!item)]}
			/>
		</BaseWrapper>
	);
}
