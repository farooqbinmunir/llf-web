import { socialNetworkNames } from '@/config/navigation';
import type { SocialLink } from '@/lib/data/global';

// `withLabels` names each network beside its icon, in two columns, as the Contact page's Follow LLF card does.
type SocialNavigationProps = { label: string; links: SocialLink[]; withLabels?: boolean };

export default function SocialNavigation({ label, links, withLabels }: SocialNavigationProps) {
	if (links.length === 0) return null;

	return (
		<nav className={withLabels ? 'rsg-social-navigation with-labels' : 'rsg-social-navigation'} aria-label={label}>
			<ul role="list">
				{links.map(({ network, url }) => (
					<li key={network} className="rsg-nav-item">
						<a className={`rsg-nav-link rsg-fa ${network}`} href={url} aria-label={withLabels ? undefined : socialNetworkNames[network]}>
							{withLabels && socialNetworkNames[network]}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
