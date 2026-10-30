import type { ReactNode } from 'react';
import Link from 'next/link';
import Carousel from '@/components/carousel/Carousel';
import type { Dictionary } from '@/i18n/dictionaries';

type RelatedContentProps = {
	id: string;
	title: string;
	palette: 'dark' | 'light';
	viewAll: { label: string; href: string };
	labels: Dictionary['carousel'];
	children: ReactNode;
};

// A labelled carousel of tiles ("Related stories", "Related projects") with a link to the full listing beside the dots.
export default function RelatedContent({ id, title, palette, viewAll, labels, children }: RelatedContentProps) {
	return (
		<section className={`related-content rsg-module section-rounded-top section-wrapper-small rsg-surface-${palette}`} aria-labelledby={id}>
			<div className="container-xxl">
				<h2 id={id} className="rsg-label">
					{title}
				</h2>

				<Carousel
					label={title}
					labels={labels}
					footer={
						<Link className="rsg-button" href={viewAll.href}>
							{viewAll.label}
						</Link>
					}
				>
					{children}
				</Carousel>
			</div>
		</section>
	);
}
