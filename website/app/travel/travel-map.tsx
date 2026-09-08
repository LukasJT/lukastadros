'use client';
import {useEffect,useRef,useState} from 'react';
import type {Map as LeafletMap} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {places,type Place} from '../../content/site';
export default function TravelMap(){
 const container=useRef<HTMLDivElement>(null);const mapRef=useRef<LeafletMap|null>(null);
 const [selected,setSelected]=useState<Place|null>(null);const [status,setStatus]=useState('Loading map…');
 function select(place:Place){setSelected(place);mapRef.current?.flyTo([place.lat,place.lng],6,{animate:!window.matchMedia('(prefers-reduced-motion: reduce)').matches});}
 useEffect(()=>{let cancelled=false;let instance:LeafletMap|undefined;
 import('leaflet').then(L=>{if(cancelled||!container.current)return;instance=L.map(container.current,{scrollWheelZoom:false,worldCopyJump:true,minZoom:2}).setView([25,0],2);mapRef.current=instance;
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(instance);
 let tileFailed=false;tiles.on('loading',()=>{tileFailed=false;});tiles.on('tileerror',()=>{tileFailed=true;setStatus('Some map tiles could not load. Check your connection; destination albums remain available below.');});tiles.on('load',()=>{if(!tileFailed)setStatus('');});
 places.forEach(place=>{L.marker([place.lat,place.lng],{title:place.name,alt:`Open photos from ${place.name}`,icon:L.divIcon({className:'travel-pin',html:'<svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true"><path d="M15 39C13 35 1 22 1 15a14 14 0 0 1 28 0c0 7-12 20-14 24Z" fill="#214dc7" stroke="white" stroke-width="2"/><circle cx="15" cy="15" r="4" fill="white"/></svg>',iconSize:[30,40],iconAnchor:[15,40]})}).addTo(instance!).on('click',()=>select(place));});
 }).catch(()=>setStatus('The map could not load. Refresh the page to try again. You can still open available albums.'));
 return()=>{cancelled=true;instance?.remove();mapRef.current=null;};},[]);
 return <><div className="map-layout"><div><div ref={container} className="map" role="region" aria-label="Interactive world travel map"/>{status&&<p className="status" role="status">{status}</p>}</div><aside className="album" aria-live="polite">{selected?<><h2>{selected.name}</h2><p>{selected.country}</p><p>{selected.description}</p>{selected.photos.length?selected.photos.map(photo=><figure key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" onError={e=>{e.currentTarget.alt='Photo unavailable: '+photo.alt;}}/>{photo.caption&&<figcaption className="gallery-caption">{photo.caption}</figcaption>}</figure>):<p style={{marginTop:24}}>Photos from this trip are coming soon.</p>}</>:<><h2>{places.length?'Choose a place':'The world, for now.'}</h2><p>{places.length?'Select a map pin or a destination below to explore an album.':'My destinations and photo albums are coming soon. In the meantime, explore the map.'}</p></>}</aside></div>{places.length>0&&<section aria-label="Destination albums">{places.map(place=><button className="place-button" key={place.id} onClick={()=>select(place)} aria-pressed={selected?.id===place.id}>{place.name}, {place.country}</button>)}</section>}</>;
}

