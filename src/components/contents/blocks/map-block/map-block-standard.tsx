import WrappedCollection, { type CollectionHeading } from '@/components/contents/blocks/_blueprints/wrapped-collection';
import MapCanvas from '@/components/contents/blocks/map-block/map-canvas';
import StatisticBlockStandard from '@/components/contents/blocks/statistic-block/statistic-block-standard';
import type { Country } from '@/lib/data/about';
import type { Stat } from '@/lib/strapi/types';

type MapBlockStandardProps = { heading: CollectionHeading & { id: string }; stats: Stat[]; countries: Country[] };

// The area the map artwork (public/images/world-map.svg) shows, in a Mercator projection. The artwork was drawn to
// these bounds, so they place the pins.
const MAP_BOUNDS = { west: -26, east: 126, north: 58, south: -40 };

const mercatorY = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + (latitude * Math.PI) / 360));
const toX = (longitude: number) => ((longitude - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
const toY = (latitude: number) => ((mercatorY(MAP_BOUNDS.north) - mercatorY(latitude)) / (mercatorY(MAP_BOUNDS.north) - mercatorY(MAP_BOUNDS.south))) * 100;

// The header and headline figures beside a map with a pin on each country that has coordinates, as Impact in action is
// designed. The pins drop from west to east.
export default function MapBlockStandard({ heading, stats, countries }: MapBlockStandardProps) {
	const pins = countries
		.flatMap(({ documentId, latitude, longitude }) => (latitude === null || longitude === null ? [] : [{ key: documentId, longitude, x: toX(longitude), y: toY(latitude) }]))
		.filter((pin) => pin.x >= 0 && pin.x <= 100 && pin.y >= 0 && pin.y <= 100)
		.sort((a, b) => a.longitude - b.longitude)
		.map(({ key, x, y }) => ({ key, x, y }));

	return (
		<div className="map-block standard" role="region" aria-labelledby={heading.id}>
			<MapCanvas pins={pins} />

			<WrappedCollection
				heading={heading}
				body={
					stats.length > 0 && (
						<ul className="statistics" role="list">
							{stats.map((stat) => (
								<li key={`${stat.value}-${stat.description}`} className="item">
									<StatisticBlockStandard prefix={stat.label} statistic={stat.value} footnote={stat.description} countUp />
								</li>
							))}
						</ul>
					)
				}
			/>
		</div>
	);
}
