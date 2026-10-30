import type { ReactNode } from 'react';
import Link from 'next/link';
import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import Carousel from '@/components/helpers/carousel';
import type { BreakpointName } from '@/hooks/useBreakpointUp';
import type { Dictionary } from '@/i18n/dictionaries';

type ListingBlockCarouselProps = {
	// The label, or the title when there is no label, also names the carousel.
	heading: CollectionHeading & { id: string };
	viewAll: { label: string; href: string };
	carouselLabels: Dictionary['carousel'];
	// Presentation, as Radstone's item classes: `center-aligned` (centred header).
	classes?: string;
	// A two-column grid instead of a carousel from this breakpoint up, as for Latest announcements.
	gridFrom?: BreakpointName;
	// One tile per slide.
	children: ReactNode;
};

// A labelled carousel of tiles ("Related stories", "Latest announcements") with a link to the full listing beside the dots.
export default function ListingBlockCarousel({ heading, viewAll, carouselLabels, classes, gridFrom, children }: ListingBlockCarouselProps) {
	return (
		<div className="listing-block carousel" role="region" aria-labelledby={heading.id}>
			<WrappedCollection
				heading={heading}
				classes={classes}
				body={
					<Carousel
						label={heading.label ?? heading.title ?? ''}
						labels={carouselLabels}
						gridFrom={gridFrom}
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
