import type { Dictionary } from '@/i18n/dictionaries';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { Download } from '@/lib/strapi/types';

type DownloadLinkProps = {
	download: Download;
	labels: Dictionary['contact'];
	// The link names the download itself ("Call for financing application | Download PDF"), when no heading does.
	withTitle?: boolean;
};

// A link to a Library resource's file, naming its type ("Download PDF"), or to an external resource. Both open in a new tab.
export default function DownloadLink({ download, labels, withTitle }: DownloadLinkProps) {
	const file = download.resource?.file;
	const href = file ? strapiMediaUrl(file.url) : download.resource?.externalUrl;
	if (!href) return null;

	return (
		<a className={file ? 'rsg-link download' : 'rsg-link download external'} href={href} target="_blank" rel="noopener noreferrer">
			{withTitle && <span className="rsg-link-title">{download.title}</span>}
			<span className="rsg-action rsg-fa">{file ? labels.download.replace('{type}', file.ext.replace('.', '').toUpperCase()) : labels.viewResource}</span>
			<span className="rsg-visually-hidden">{` ${labels.opensInNewTab}`}</span>
		</a>
	);
}
