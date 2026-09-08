import PageShell from '../../components/page-shell';
import TravelMap from './travel-map';
export default function Travel(){return <PageShell active="Travel" title="Places & memories." description="Look around the map. As my travel collection grows, select a place to open its photos and stories."><TravelMap/><p className="map-note">Drag to explore. Use + and − to zoom, or focus the map and use the arrow keys.</p></PageShell>}
