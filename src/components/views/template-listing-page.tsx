import type { ReactNode } from 'react';
import type { Palette } from '@/components/contents/blocks/base-wrapper';
import LoadMore from '@/components/global/navigation/load-more/load-more';

type TemplateListingPageProps = {
	// The heading inside the section that names it, when the section has one.
	labelledBy?: string;
	// Without a brand the section is on the page's own light surface, with no spacing above it.
	brand?: Palette;
	// The section's spacing and shape, such as `section-wrapper-small section-rounded-top`.
	wrapperClasses: string;
	// Anything above the filters, such as the projects' phase pills and introduction.
	header?: ReactNode;
	children: ReactNode;
};

type TemplateListingResultsProps = {
	filters: ReactNode;
	// Announced to screen readers when the results change, such as "Showing 9 of 10 stories".
	status: string;
	noResults: string;
	tiles: { key: string; tile: ReactNode }[];
	loadMore: { nextHref?: string; label: string; filters: { id: string; label: string } };
};

// A listing page's section: its header, then the filters and results (TemplateListingResults), which stream in.
export default function TemplateListingPage({ labelledBy, brand, wrapperClasses, header, children }: TemplateListingPageProps) {
	const Tag = labelledBy ? 'section' : 'div';

	return (
		<Tag className={brand ? `rsg-module ${wrapperClasses} rsg-surface-${brand}` : `rsg-module ${wrapperClasses}`} aria-labelledby={labelledBy}>
			<div className="container-xxl">
				<div className="template-listing-page">
					{header}
					{children}
				</div>
			</div>
		</Tag>
	);
}

export function TemplateListingResults({ filters, status, noResults, tiles, loadMore }: TemplateListingResultsProps) {
	return (
		<>
			{filters}

			<p className="results-count rsg-visually-hidden" aria-live="polite">
				{status}
			</p>

			{tiles.length > 0 ? (
				<div className="row rsg-listing-results" role="list">
					{tiles.map(({ key, tile }) => (
						<div key={key} className="col col-12 col-md-6 col-lg-4" role="listitem">
							{tile}
						</div>
					))}
				</div>
			) : (
				<p className="rsg-no-results">{noResults}</p>
			)}

			<LoadMore {...loadMore} />
		</>
	);
}
