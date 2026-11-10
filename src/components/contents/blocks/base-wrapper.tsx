import type { ReactNode } from 'react';
import ResponsiveImage from '@/components/helpers/image';
import type { BlockSettings, Media } from '@/lib/strapi/types';

export type Palette = 'dark' | 'light' | 'yellow';

type BaseWrapperProps = {
	// The section's spacing and shape, as Radstone's container settings give them: `section-wrapper-small`, `section-rounded-top`.
	wrapperClasses?: string;
	brand?: Palette;
	// The column the block sits in, such as `col-12 col-lg-8 offset-lg-2`.
	colClasses?: string;
	// The block runs edge to edge, with no container, row or column, and places its own containers (the stories slider).
	fullWidth?: boolean;
	// A photo behind the section, as texture under its content.
	backgroundImage?: Media | null;
	// The section's id, so a link can jump to it (/about-us#partners).
	anchor?: string | null;
	children: ReactNode;
};

// The section every block sits in: `rsg-module` > container > row > column, as in Radstone's base wrapper.
export default function BaseWrapper({ wrapperClasses = 'section-wrapper-small', brand, colClasses = 'col-12', fullWidth, backgroundImage, anchor, children }: BaseWrapperProps) {
	const classes = ['rsg-module', wrapperClasses, brand && `rsg-surface-${brand}`, backgroundImage && 'has-background-media'].filter(Boolean).join(' ');

	return (
		<div id={anchor || undefined} className={classes}>
			{backgroundImage && (
				<div className="rsg-background-media" aria-hidden="true">
					<ResponsiveImage image={backgroundImage} aspectRatio="orig" sizes="100vw" alt="" />
				</div>
			)}

			{fullWidth ? (
				children
			) : (
				<div className="container-xxl">
					<div className="row">
						<div className={`col ${colClasses}`}>{children}</div>
					</div>
				</div>
			)}
		</div>
	);
}

// The wrapper props a block's settings give: its palette, a rounded top, a photo behind it and its anchor.
export const settingsWrapperProps = (settings: BlockSettings | null) => ({
	brand: settings?.brand,
	wrapperClasses: ['section-wrapper-small', settings?.roundedTop && 'section-rounded-top'].filter(Boolean).join(' '),
	backgroundImage: settings?.backgroundImage,
	anchor: settings?.anchor,
});
