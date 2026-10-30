import ResponsiveImage from '@/components/helpers/image';
import type { Media } from '@/lib/strapi/types';

type MediaBlockProps = { image: Media; caption?: string | null; aspectRatio: string; sizes: string; alt?: string; preload?: boolean };

// A photo, with its caption when it has one. Tiles, quotes and headers include it for their media as well.
export default function MediaBlockStandard({ image, caption, aspectRatio, sizes, alt, preload }: MediaBlockProps) {
	return (
		<div className="media-block standard">
			<ResponsiveImage image={image} caption={caption} aspectRatio={aspectRatio} sizes={sizes} alt={alt} preload={preload} />
		</div>
	);
}
