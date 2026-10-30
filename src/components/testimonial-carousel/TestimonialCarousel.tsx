import Image from 'next/image';
import Carousel from '@/components/carousel/Carousel';
import type { Dictionary } from '@/i18n/dictionaries';
import { strapiMediaUrl } from '@/lib/strapi/client';
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
							<figure key={testimonial.quote} className="testimonial">
								<blockquote className="quote">
									<p>{testimonial.quote}</p>
								</blockquote>

								{(testimonial.name || testimonial.role || testimonial.photo) && (
									<figcaption className="person">
										{testimonial.photo && <Image className="photo" src={strapiMediaUrl(testimonial.photo.url)} alt="" width={96} height={96} />}
										<span className="details">
											{testimonial.name && <span className="name">{testimonial.name}</span>}
											{testimonial.role && <span className="role">{testimonial.role}</span>}
										</span>
									</figcaption>
								)}
							</figure>
						))}
					</Carousel>
				</div>
			</div>
		</section>
	);
}
