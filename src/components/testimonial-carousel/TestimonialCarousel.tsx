import Carousel from '@/components/carousel/Carousel';
import PullQuote from '@/components/pull-quote/PullQuote';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Testimonial } from '@/lib/strapi/types';

type TestimonialCarouselProps = { title: string; context: string; testimonials: Testimonial[]; labels: Dictionary['carousel'] };

// One quote per slide, with the person's photo, name and role, between two lines; dots page through the quotes.
export default function TestimonialCarousel({ title, context, testimonials, labels }: TestimonialCarouselProps) {
	return (
		<section className="testimonial-carousel rsg-module section-rounded-top section-wrapper-small rsg-surface-dark" aria-labelledby="testimonials-title">
			<div className="container-xxl">
				<div className="content">
					<h2 id="testimonials-title" className="rsg-label">
						{title}
					</h2>
					<p className="context">{context}</p>

					<Carousel label={title} labels={labels}>
						{testimonials.map((testimonial) => (
							<PullQuote key={testimonial.quote} testimonial={testimonial} />
						))}
					</Carousel>
				</div>
			</div>
		</section>
	);
}
