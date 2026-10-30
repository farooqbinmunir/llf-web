import Image from 'next/image';
import TextWithBreaks from '@/components/text-with-breaks/TextWithBreaks';
import { strapiMediaUrl } from '@/lib/strapi/client';
import type { Testimonial } from '@/lib/strapi/types';

type PullQuoteProps = { testimonial: Testimonial; className?: string };

// A quote under an accent quote mark, then the person's photo, name and role.
export default function PullQuote({ testimonial, className }: PullQuoteProps) {
	const { quote, name, role, photo } = testimonial;

	return (
		<figure className={className ? `pull-quote ${className}` : 'pull-quote'}>
			<blockquote className="quote">
				<p>{quote}</p>
			</blockquote>

			{(name || role || photo) && (
				<figcaption className="person">
					{photo && <Image className="photo" src={strapiMediaUrl(photo.url)} alt="" width={96} height={96} />}
					<span className="details">
						{name && <span className="name">{name}</span>}
						{role && (
							<span className="role">
								<TextWithBreaks text={role} />
							</span>
						)}
					</span>
				</figcaption>
			)}
		</figure>
	);
}
