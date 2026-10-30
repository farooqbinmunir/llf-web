import CopyLink from './copy-link';

type SharingLinksProps = {
	url: string;
	title: string;
	labels: { shareOn: string; shareByEmail: string; copyLink: string; linkCopied: string };
};

// Plain links to each network's share page, so sharing works without JavaScript; only copying the link needs a script.
export default function SharingLinks({ url, title, labels }: SharingLinksProps) {
	const link = encodeURIComponent(url);
	const text = encodeURIComponent(title);
	const networks = [
		{ name: 'linkedin', label: labels.shareOn.replace('{network}', 'LinkedIn'), href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}` },
		{ name: 'facebook', label: labels.shareOn.replace('{network}', 'Facebook'), href: `https://www.facebook.com/sharer/sharer.php?u=${link}` },
		{ name: 'x-twitter', label: labels.shareOn.replace('{network}', 'X'), href: `https://x.com/intent/post?url=${link}&text=${text}` },
	];

	return (
		<ul className="rsg-sharing-links" role="list">
			{networks.map((network) => (
				<li key={network.name}>
					<a className={`rsg-fa ${network.name}`} href={network.href} target="_blank" rel="noopener noreferrer">
						<span className="rsg-visually-hidden">{network.label}</span>
					</a>
				</li>
			))}
			<li>
				<a className="rsg-fa email" href={`mailto:?subject=${text}&body=${link}`}>
					<span className="rsg-visually-hidden">{labels.shareByEmail}</span>
				</a>
			</li>
			<li>
				<CopyLink url={url} label={labels.copyLink} copiedLabel={labels.linkCopied} />
			</li>
		</ul>
	);
}
