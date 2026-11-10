import type { ReactNode } from 'react';
import Link from 'next/link';
import type { CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import Carousel from '@/components/helpers/carousel';
import TextWithBreaks from '@/components/helpers/text-with-breaks';
import type { Dictionary } from '@/i18n/dictionaries';

type ListingBlockSliderProps = {
	// The label, or the title when there is no label, also names the carousel.
	heading: CollectionHeading & { id: string };
	viewAll?: { label: string; href: string };
	carouselLabels: Dictionary['carousel'];
	// One full-width tile per slide.
	children: ReactNode;
};

// One full-width slide at a time, with the section's label and title over the top of the slides and the dots and
// "View all" link over their foot, as Stories of change is designed on desktop. It sits in a full-width wrapper, so it
// places its own containers.
export default function ListingBlockSlider({ heading, viewAll, carouselLabels, children }: ListingBlockSliderProps) {
	return (
		<div className="listing-block slider" role="region" aria-labelledby={heading.id}>
			<Carousel
				label={heading.label ?? heading.title ?? ''}
				labels={carouselLabels}
				header={
					<div className="container-xxl">
						<div className="rsg-col-header">
							{heading.label && <p className="rsg-label">{heading.label}</p>}
							{heading.title && (
								<h2 id={heading.id} className="rsg-title">
									<TextWithBreaks text={heading.title} />
								</h2>
							)}
						</div>
					</div>
				}
				footer={
					viewAll && (
						<div className="rsg-link-list">
							<Link className="rsg-button" href={viewAll.href}>
								{viewAll.label}
							</Link>
						</div>
					)
				}
			>
				{children}
			</Carousel>
		</div>
	);
}
