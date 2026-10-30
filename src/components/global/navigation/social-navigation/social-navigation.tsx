import { socialLinks } from '@/config/navigation';

type SocialNavigationProps = { label: string };

export default function SocialNavigation({ label }: SocialNavigationProps) {
	return (
		<nav className="rsg-social-navigation" aria-label={label}>
			<ul role="list">
				{socialLinks.map(({ network, label: networkLabel, href }) => (
					<li key={network} className="rsg-nav-item">
						<a className={`rsg-nav-link rsg-fa ${network}`} href={href} aria-label={networkLabel} />
					</li>
				))}
			</ul>
		</nav>
	);
}
