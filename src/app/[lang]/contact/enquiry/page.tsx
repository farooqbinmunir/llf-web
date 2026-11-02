import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import WrappedCollection from '@/components/contents/blocks/_blueprints/wrapped-collection';
import BaseWrapper from '@/components/contents/blocks/base-wrapper';
import FormEnquiry from '@/components/global/forms/form-enquiry';
import { hasLocale, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { getContactPage, type ContactPage } from '@/lib/data/contact';
import { isEnquiryTopic } from '@/lib/forms';
import { readParam, type SearchParams } from '@/lib/search-params';

const NARROW_COLUMN = 'col-12 col-lg-8 offset-lg-2';

type EnquiryProps = { lang: Locale; searchParams: Promise<SearchParams>; form: ContactPage['form']; dictionary: Dictionary };

// The form opens on the topic of the Contact card the visitor followed (`?topic=financing`), or on a general enquiry.
async function Enquiry({ lang, searchParams, form, dictionary }: EnquiryProps) {
	const topic = readParam((await searchParams).topic);

	return (
		<FormEnquiry
			lang={lang}
			topic={isEnquiryTopic(topic) ? topic : 'general'}
			success={{ title: form?.successTitle ?? null, text: form?.successText ?? null }}
			labels={dictionary.forms}
			backLabel={dictionary.contact.backToContact}
		/>
	);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/contact/enquiry'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const page = await getContactPage(lang);

	return { title: page?.form?.title, description: page?.form?.text ?? undefined };
}

export default async function EnquiryPage({ params, searchParams }: PageProps<'/[lang]/contact/enquiry'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [page, dictionary] = await Promise.all([getContactPage(lang), getDictionary(lang)]);
	if (!page?.form) notFound();

	return (
		<BaseWrapper wrapperClasses="section-wrapper-small" brand="light" colClasses={NARROW_COLUMN}>
			<WrappedCollection
				classes="center-aligned"
				heading={{ id: 'enquiry-title', title: page.form.title, text: page.form.text, titleTag: 'h1' }}
				body={
					<Suspense fallback={<div className="rsg-form-enquiry rsg-surface-light-4" />}>
						<Enquiry lang={lang} searchParams={searchParams} form={page.form} dictionary={dictionary} />
					</Suspense>
				}
			/>
		</BaseWrapper>
	);
}
