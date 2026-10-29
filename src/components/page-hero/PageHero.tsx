import Image from 'next/image';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { PageHero as PageHeroData } from '@/lib/strapi/types';

type PageHeroProps = { hero: PageHeroData };

export default function PageHero({ hero }: PageHeroProps) {
	const { eyebrow, title, text, image } = hero;

	return (
		<section className="rsg-page-hero surface-dark">
			{/* The photo is atmosphere behind the heading, so it is decorative. It is the largest element on load, hence preload. */}
			{image && <Image className="rsg-page-hero__image" src={strapiMediaUrl(image.url)} alt="" fill sizes="100vw" preload />}

			<div className="rsg-container rsg-page-hero__content">
				{eyebrow && <p className="rsg-eyebrow">{eyebrow}</p>}
				<h1 className="rsg-page-hero__title">{title}</h1>
				{text && <p className="rsg-page-hero__text">{text}</p>}
			</div>
		</section>
	);
}
