'use client';

import { useState } from 'react';

type CopyLinkProps = { url: string; label: string; copiedLabel: string };

// Copies the page URL. The button's hidden text is a live region, so screen readers announce "Link copied" when it changes.
export default function CopyLink({ url, label, copiedLabel }: CopyLinkProps) {
	const [isCopied, setIsCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(url);
		setIsCopied(true);
	}

	return (
		<button className={isCopied ? 'rsg-fa copy-link is-copied' : 'rsg-fa copy-link'} type="button" onClick={copy} onBlur={() => setIsCopied(false)}>
			<span className="rsg-visually-hidden" aria-live="polite">
				{isCopied ? copiedLabel : label}
			</span>
		</button>
	);
}
