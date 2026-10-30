import type { ReactNode } from 'react';
import ResponsiveImage from '@/components/helpers/image';
import type { Media } from '@/lib/strapi/types';

export type Palette = 'dark' | 'light' | 'yellow';

type BaseWrapperProps = {
	// The section's spacing and shape, as Radstone's container settings give them: `section-wrapper-small`, `section-rounded-top`.
	wrapperClasses?: string;
	brand?: Palette;
	// The column the block sits in, such as `col-12 col-lg-8 offset-lg-2`.
	colClasses?: string;
	// A photo behind the section, as texture under its content.
	backgroundImage?: Media | null;
	children: ReactNode;
};

// The section every block sits in: `rsg-module` > container > row > column, as in Radstone's base wrapper.
export default function BaseWrapper({ wrapperClasses = 'section-wrapper-small', brand, colClasses = 'col-12', backgroundImage, children }: BaseWrapperProps) {
	const classes = ['rsg-module', wrapperClasses, brand && `rsg-surface-${brand}`, backgroundImage && 'has-background-media'].filter(Boolean).join(' ');

	return (
		<div className={classes}>
			{backgroundImage && (
				<div className="rsg-background-media" aria-hidden="true">
					<ResponsiveImage image={backgroundImage} aspectRatio="orig" sizes="100vw" alt="" />
				</div>
			)}

			<div className="container-xxl">
				<div className="row">
					<div className={`col ${colClasses}`}>{children}</div>
				</div>
			</div>
		</div>
	);
}
