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
	// `list` stacks the tiles as ruled rows in a centred column, as the News listing; tiles sit in a three-column grid otherwise.
	layout?: 'grid' | 'list';
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

const COLUMNS = { grid: 'col-12 col-md-6 col-lg-4', list: 'col-12 col-lg-8 offset-lg-2' };

export function TemplateListingResults({ filters, status, noResults, tiles, layout = 'grid', loadMore }: TemplateListingResultsProps) {
	return (
		<>
			{filters}

			<p className="results-count rsg-visually-hidden" aria-live="polite">
				{status}
			</p>

			{tiles.length > 0 ? (
				<div className={`row rsg-listing-results ${layout}`} role="list">
					{tiles.map(({ key, tile }) => (
						<div key={key} className={`col ${COLUMNS[layout]}`} role="listitem">
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
