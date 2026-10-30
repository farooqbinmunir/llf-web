import Image from 'next/image';
import Link from 'next/link';
import { localisedPath, type Locale } from '@/i18n/config';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { CallToAction } from '@/lib/strapi/types';

type CtaBannerProps = { lang: Locale; cta: CallToAction };

// Editors enter site paths without a language ("/partnerships"), so the same entry works in every locale; full URLs pass through.
const resolveHref = (lang: Locale, url: string) => (url.startsWith('/') ? localisedPath(lang, url) : url);

export default function CtaBanner({ lang, cta }: CtaBannerProps) {
	const { title, text, linkLabel, linkUrl, image } = cta;

	return (
		<section className="cta-banner rsg-surface-dark">
			{image && <Image className="image" src={strapiMediaUrl(image.url)} alt="" fill sizes="100vw" />}

			<div className="container-xxl content">
				<div className="text">
					<h2 className="rsg-title">{title}</h2>
					{text && <p>{text}</p>}
				</div>

				{linkLabel && linkUrl && (
					<Link className="rsg-button" href={resolveHref(lang, linkUrl)}>
						{linkLabel}
					</Link>
				)}
			</div>
		</section>
	);
}
