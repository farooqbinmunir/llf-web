import Image from 'next/image';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { Media } from '@/lib/strapi/types';

type ImageProps = {
	image: Media;
	// The crop, as Radstone's image helper takes it ('3x2', '1x1', '12x5'); 'orig' keeps the photo's own shape.
	aspectRatio: string;
	sizes: string;
	caption?: string | null;
	// Decorative photos (behind a heading, or beside a link that names them) pass an empty alt.
	alt?: string;
	preload?: boolean;
};

// A photo as `rsg-picture`, or as `rsg-figure` with its caption. The crop comes from a ratio class, so the image is
// cropped by CSS (object-fit) where Radstone's helper requests a cropped size from the server.
export default function ResponsiveImage({ image, aspectRatio, sizes, caption, alt, preload }: ImageProps) {
	const picture = (
		<picture className={`rsg-picture ratio-${aspectRatio}`}>
			<Image src={strapiMediaUrl(image.url)} alt={alt ?? image.alternativeText ?? ''} width={image.width} height={image.height} sizes={sizes} preload={preload} />
		</picture>
	);

	if (!caption) return picture;

	return (
		<figure className="rsg-figure">
			{picture}
			<figcaption className="rsg-figcaption">{caption}</figcaption>
		</figure>
	);
}
