import type { Dictionary } from '@/i18n/dictionaries';
import CopyLink from './CopyLink';

type ShareLinksProps = { url: string; title: string; labels: Dictionary['story'] };

// Plain links to each network's share page, so sharing works without JavaScript; only copying the link needs a script.
export default function ShareLinks({ url, title, labels }: ShareLinksProps) {
	const link = encodeURIComponent(url);
	const text = encodeURIComponent(title);
	const networks = [
		{ name: 'linkedin', label: labels.shareOn.replace('{network}', 'LinkedIn'), href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}` },
		{ name: 'facebook', label: labels.shareOn.replace('{network}', 'Facebook'), href: `https://www.facebook.com/sharer/sharer.php?u=${link}` },
		{ name: 'x', label: labels.shareOn.replace('{network}', 'X'), href: `https://x.com/intent/post?url=${link}&text=${text}` },
	];

	return (
		<div className="share-links">
			<p className="label" id="share-links-label">
				{labels.share}
			</p>

			<ul className="list" role="list" aria-labelledby="share-links-label">
				{networks.map((network) => (
					<li key={network.name}>
						<a className={`link ${network.name}`} href={network.href} target="_blank" rel="noopener noreferrer" aria-label={network.label} />
					</li>
				))}
				<li>
					<a className="link email" href={`mailto:?subject=${text}&body=${link}`} aria-label={labels.shareByEmail} />
				</li>
				<li>
					<CopyLink url={url} label={labels.copyLink} copiedLabel={labels.linkCopied} />
				</li>
			</ul>
		</div>
	);
}
