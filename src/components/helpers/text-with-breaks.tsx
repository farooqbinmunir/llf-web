import { Fragment } from 'react';

type TextWithBreaksProps = { text: string };

// Manual line breaks for headings and short text, from the CMS or the dictionaries, so one value serves every width:
// a new line breaks everywhere, and `|` breaks on mobile only (a space on wider screens).
export default function TextWithBreaks({ text }: TextWithBreaksProps) {
	return text.split('\n').map((line, lineIndex) => (
		<Fragment key={lineIndex}>
			{lineIndex > 0 && <br />}
			{line.split('|').map((part, partIndex) => (
				<Fragment key={partIndex}>
					{partIndex > 0 && (
						<>
							{' '}
							<br className="mobile-break" />
						</>
					)}
					{part.trim()}
				</Fragment>
			))}
		</Fragment>
	));
}

// The same text with the markers removed, for places that cannot hold markup, such as metadata and aria-label.
export const withoutBreaks = (text: string) => text.replace(/\s*[|\n]\s*/g, ' ');
