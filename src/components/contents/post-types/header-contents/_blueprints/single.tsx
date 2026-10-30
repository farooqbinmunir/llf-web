import ResponsiveImage from '@/components/helpers/image';
import type { PageHero } from '@/lib/strapi/types';

// `large-image` sets the heading over a full-width photo on dark; `colour` is a plain light band, centred from lg up.
type HeaderContentsSingleProps = { hero: PageHero; layout?: 'large-image' | 'colour' };

// A page's header: the label, the page heading and a short introduction.
export default function HeaderContentsSingle({ hero, layout = 'large-image' }: HeaderContentsSingleProps) {
	const { eyebrow, title, text, image } = hero;
	const surface = layout === 'large-image' ? 'rsg-surface-dark' : 'rsg-surface-light';

	return (
		<div className={`header-contents blueprint single layout-${layout} ${surface}`}>
			{/* The photo is atmosphere behind the heading, so it is decorative. It is the largest element on load, hence preload. */}
			{layout === 'large-image' && image && (
				<div className="rsg-media-wrapper">
					<ResponsiveImage image={image} aspectRatio="orig" sizes="100vw" alt="" preload />
				</div>
			)}

			<div className="container-xxl">
				<div className="rsg-content-wrapper">
					{eyebrow && <p className="rsg-label">{eyebrow}</p>}
					<h1 className="rsg-title">{title}</h1>
					{text && <p className="rsg-text">{text}</p>}
				</div>
			</div>
		</div>
	);
}
