import Image from 'next/image';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { PageHero as PageHeroData } from '@/lib/strapi/types';

type PageHeroProps = { hero: PageHeroData };

export default function PageHero({ hero }: PageHeroProps) {
	const { eyebrow, title, text, image } = hero;

	return (
		<section className="page-hero rsg-surface-dark">
			{/* The photo is atmosphere behind the heading, so it is decorative. It is the largest element on load, hence preload. */}
			{image && <Image className="image" src={strapiMediaUrl(image.url)} alt="" fill sizes="100vw" preload />}

			<div className="container-xxl content">
				{eyebrow && <p className="rsg-label">{eyebrow}</p>}
				<h1 className="rsg-title">{title}</h1>
				{text && <p className="text">{text}</p>}
			</div>
		</section>
	);
}
