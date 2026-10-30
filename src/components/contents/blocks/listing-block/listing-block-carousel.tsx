import type { ReactNode } from 'react';
import Link from 'next/link';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import Carousel from '@/components/helpers/carousel';
import type { Dictionary } from '@/i18n/dictionaries';

type ListingBlockCarouselProps = {
	heading: CollectionHeading & { id: string; label: string };
	viewAll: { label: string; href: string };
	carouselLabels: Dictionary['carousel'];
	// One tile per slide.
	children: ReactNode;
};

// A labelled carousel of tiles ("Related stories", "Related projects") with a link to the full listing beside the dots.
export default function ListingBlockCarousel({ heading, viewAll, carouselLabels, children }: ListingBlockCarouselProps) {
	return (
		<div className="listing-block carousel" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				heading={heading}
				body={
					<Carousel
						label={heading.label}
						labels={carouselLabels}
						footer={
							<div className="rsg-link-list">
								<Link className="rsg-button" href={viewAll.href}>
									{viewAll.label}
								</Link>
							</div>
						}
					>
						{children}
					</Carousel>
				}
			/>
		</div>
	);
}
