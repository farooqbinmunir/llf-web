import { socialLinks } from '@/config/navigation';

// `withLabels` names each network beside its icon, in two columns, as the Contact page's Follow LLF card does.
type SocialNavigationProps = { label: string; withLabels?: boolean };

export default function SocialNavigation({ label, withLabels }: SocialNavigationProps) {
	return (
		<nav className={withLabels ? 'rsg-social-navigation with-labels' : 'rsg-social-navigation'} aria-label={label}>
			<ul role="list">
				{socialLinks.map(({ network, label: networkLabel, href }) => (
					<li key={network} className="rsg-nav-item">
						<a className={`rsg-nav-link rsg-fa ${network}`} href={href} aria-label={withLabels ? undefined : networkLabel}>
							{withLabels && networkLabel}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
