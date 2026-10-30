'use client';

import { useState } from 'react';

type CopyLinkProps = { url: string; label: string; copiedLabel: string };

// Copies the page URL and announces it. The status region is always rendered, so screen readers pick up the change.
export default function CopyLink({ url, label, copiedLabel }: CopyLinkProps) {
	const [isCopied, setIsCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(url);
		setIsCopied(true);
	}

	return (
		<>
			<button className={isCopied ? 'link copy is-copied' : 'link copy'} type="button" aria-label={label} onClick={copy} onBlur={() => setIsCopied(false)} />
			<span className="rsg-visually-hidden" role="status">
				{isCopied ? copiedLabel : ''}
			</span>
		</>
	);
}
