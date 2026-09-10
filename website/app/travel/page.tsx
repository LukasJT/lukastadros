import PageShell from '../../components/page-shell';
import TravelMap from './travel-map';
import {readContent} from '../../lib/content';
export const dynamic='force-dynamic';
export default async function Travel(){const {content}=await readContent();const c=content.copy;return <PageShell active="Travel" name={c.name} footer={c.footer} title={c.travelTitle} description={c.travelDescription}><TravelMap places={content.places} emptyTitle={c.travelEmptyTitle} emptyDescription={c.travelEmptyDescription}/><p className="map-note">Drag to explore. Use + and − to zoom, or focus the map and use the arrow keys.</p></PageShell>}
