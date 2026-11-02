import MediaBlockStandard from '@/components/contents/blocks/media-block/media-block-standard';
import type { Person } from '@/lib/data/governance';

type PersonTileProps = { person: Person; sizes: string };

// A member of a governance body: square photo, then name, job title, organisation and an optional biography. It links
// nowhere, as people have no page of their own. The photo sits beside the name, so it is decorative.
export default function PersonTileStandard({ person, sizes }: PersonTileProps) {
	const { name, jobTitle, organisation, bio, photo } = person;

	return (
		<div className={`tile person standard${photo ? '' : ' no-media'}`}>
			{photo && (
				<div className="rsg-media-wrapper">
					<MediaBlockStandard image={photo} aspectRatio="1x1" sizes={sizes} alt="" />
				</div>
			)}

			<div className="rsg-content-wrapper">
				<p className="rsg-title">{name}</p>
				{jobTitle && <p className="rsg-role">{jobTitle}</p>}
				{organisation && <p className="rsg-organisation">{organisation}</p>}
				{bio && <p className="rsg-text">{bio}</p>}
			</div>
		</div>
	);
}
