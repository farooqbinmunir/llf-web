import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import Carousel from '@/components/helpers/carousel';
import TextWithBreaks from '@/components/helpers/text-with-breaks';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Testimonial } from '@/lib/strapi/types';

type TestimonialBlockProps = {
	testimonials: Testimonial[];
	heading?: CollectionHeading;
	// Needed when there is more than one quote, which become a carousel.
	carouselLabels?: Dictionary['carousel'];
	// `lined` puts a single quote between two lines, as in a highlight panel.
	classes?: string;
};

function TestimonialFigure({ testimonial }: { testimonial: Testimonial }) {
	const { quote, name, role, photo } = testimonial;

	return (
		<figure className="testimonial">
			<blockquote className="quote">
				<span className="quote-mark" aria-hidden="true" />
				<p>{quote}</p>
			</blockquote>

			{(name || role || photo) && (
				<figcaption className="person">
					{photo && (
						<div className="photo">
							<MediaBlockStandard image={photo} aspectRatio="1x1" sizes="96px" alt="" />
						</div>
					)}
					<div className="details">
						{name && <p className="name">{name}</p>}
						{role && (
							<p className="role">
								<TextWithBreaks text={role} />
							</p>
						)}
					</div>
				</figcaption>
			)}
		</figure>
	);
}

// Quotes with the person's photo, name and role: one on its own, or several in a carousel paged by dots.
export default function TestimonialBlockStandard({ testimonials, heading, carouselLabels, classes }: TestimonialBlockProps) {
	if (testimonials.length === 0) return null;

	const body =
		testimonials.length > 1 && carouselLabels ? (
			<Carousel label={heading?.label ?? heading?.title ?? ''} labels={carouselLabels}>
				{testimonials.map((testimonial) => (
					<TestimonialFigure key={testimonial.quote} testimonial={testimonial} />
				))}
			</Carousel>
		) : (
			<TestimonialFigure testimonial={testimonials[0]} />
		);

	return (
		<div className={classes ? `testimonial-block standard ${classes}` : 'testimonial-block standard'} role={heading?.id ? 'region' : undefined} aria-labelledby={heading?.id}>
			<WrappedCollection heading={heading} body={body} />
		</div>
	);
}
