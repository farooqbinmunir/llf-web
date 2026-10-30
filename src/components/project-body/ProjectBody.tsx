import Image from 'next/image';
import BlocksContent from '@/components/blocks-content/BlocksContent';
import TextWithBreaks from '@/components/text-with-breaks/TextWithBreaks';
import type { Locale } from '@/i18n/config';
import type { ProjectBodySection } from '@/lib/data/projects';
import { strapiMediaUrl } from '@/lib/strapi/client';

type ProjectBodyProps = { lang: Locale; sections: ProjectBodySection[] };

// The project's own sequence of photos and text sections, in the order the editor set.
export default function ProjectBody({ lang, sections }: ProjectBodyProps) {
	if (sections.length === 0) return null;

	return (
		<div className="project-body container-xxl">
			{sections.map((section) => {
				if (section.__component === 'shared.media') {
					if (!section.file) return null;

					return (
						<figure key={`media-${section.id}`} className="figure">
							<Image className="image" src={strapiMediaUrl(section.file.url)} alt={section.file.alternativeText ?? ''} width={section.file.width} height={section.file.height} sizes="(min-width: 992px) 960px, 100vw" />
							{section.caption && <figcaption className="caption">{section.caption}</figcaption>}
						</figure>
					);
				}

				if (!section.heading && !section.body?.length) return null;

				return (
					<section key={`text-${section.id}`} className="text-section">
						{section.heading && (
							<h2 className="heading">
								<TextWithBreaks text={section.heading} />
							</h2>
						)}
						{section.body && <BlocksContent lang={lang} content={section.body} />}
					</section>
				);
			})}
		</div>
	);
}
