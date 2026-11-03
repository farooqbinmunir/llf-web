import { draftMode } from 'next/headers';
import type { Dictionary } from '@/i18n/dictionaries';
import { exitPreview } from '@/lib/actions/preview';

type PreviewBannerProps = {
	labels: Dictionary['preview'];
};

// Tells an editor in draft mode that the page shows unpublished changes, with a way back to the published site. Visitors
// never see it, as only the CMS's preview link turns draft mode on.
export default async function PreviewBanner({ labels }: PreviewBannerProps) {
	const { isEnabled } = await draftMode();
	if (!isEnabled) return null;

	return (
		<aside className="rsg-preview-banner rsg-surface-yellow" aria-label={labels.label}>
			<div className="container-xxl">
				<p>{labels.message}</p>
				<form action={exitPreview}>
					<button className="rsg-button" type="submit">
						{labels.exit}
					</button>
				</form>
			</div>
		</aside>
	);
}
