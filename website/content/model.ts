import {places,courses,projects} from './site';
export type Photo={src:string;alt:string;caption?:string};
export type Course={code:string;title:string;description:string;url?:string;photo?:Photo|null};
export type Project={title:string;description:string;url?:string;photo?:Photo|null};
export type Place={id:string;name:string;country:string;lat:number;lng:number;description:string;photos:Photo[]};
export const defaultCopy={
 name:'Lukas Tadros',footer:'A work in progress.',
 homeTitle:'A little about',homeName:'Lukas.',intro:'Welcome to my corner of the internet.',summary:'A place for my coursework, the things I make, and the places I go.',projectLink:'Explore my projects',aboutTitle:'About me',bioLead:'Still writing this chapter.',bio:'My biography and a few things about me will be here soon.',portraitCaption:'Lukas Tadros',
 schoolLink:'School & coursework',schoolLinkDescription:'Notes, learning, and academic work.',projectsLink:'Projects',projectsLinkDescription:'Things I’m working on and making.',travelLink:'Travel',travelLinkDescription:'A map of places and memories.',
 schoolTitle:'School & coursework.',schoolDescription:'A place for what I’m learning, from course notes to academic work.',schoolEmptyTitle:'Learning, collected here.',schoolEmptyDescription:'School details and selected coursework are coming soon.',
 projectsTitle:'Projects.',projectsDescription:'A collection of things I make, explore, and work on.',projectsEmptyTitle:'More to share soon.',projectsEmptyDescription:'Selected projects, write-ups, and links will live here.',
 travelTitle:'Places & memories.',travelDescription:'Look around the map. As my travel collection grows, select a place to open its photos and stories.',travelEmptyTitle:'The world, for now.',travelEmptyDescription:'My destinations and photo albums are coming soon. In the meantime, explore the map.'
};
export type SiteContent={copy:typeof defaultCopy;portrait:Photo|null;courses:Course[];projects:Project[];places:Place[]};
export const defaultContent:SiteContent={copy:defaultCopy,portrait:null,courses,projects,places};
export const copyGroups:[string,[keyof typeof defaultCopy,string][]][]=[
 ['Site details',[['name','Your name'],['footer','Footer text']]],
 ['Home',[['homeTitle','Main heading'],['homeName','Highlighted name'],['intro','Introduction'],['summary','Short description'],['projectLink','Projects link text'],['aboutTitle','About heading'],['bioLead','Biography opening'],['bio','Biography'],['portraitCaption','Portrait caption'],['schoolLink','School link'],['schoolLinkDescription','School link description'],['projectsLink','Projects link'],['projectsLinkDescription','Projects link description'],['travelLink','Travel link'],['travelLinkDescription','Travel link description']]],
 ['School page',[['schoolTitle','Page heading'],['schoolDescription','Introduction'],['schoolEmptyTitle','Heading when no courses are added'],['schoolEmptyDescription','Text when no courses are added']]],
 ['Projects page',[['projectsTitle','Page heading'],['projectsDescription','Introduction'],['projectsEmptyTitle','Heading when no projects are added'],['projectsEmptyDescription','Text when no projects are added']]],
 ['Travel page',[['travelTitle','Page heading'],['travelDescription','Introduction'],['travelEmptyTitle','Heading when no trips are added'],['travelEmptyDescription','Text when no trips are added']]]
];
function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid content.');return value as Record<string,unknown>;}
function text(value:unknown,max=10000):string{if(typeof value!=='string'||value.length>max)throw new Error(`Text must be no more than ${max} characters.`);return value;}
function list<T>(value:unknown,parse:(v:unknown)=>T,max=100):T[]{if(!Array.isArray(value)||value.length>max)throw new Error(`Use no more than ${max} items.`);return value.map(parse);}
function link(value:unknown):string{if(value===undefined||value==='')return '';const url=text(value,2048);if(!/^https?:\/\//i.test(url))throw new Error('Links must start with https:// or http://.');new URL(url);return url;}
function photo(value:unknown):Photo{const p=object(value),src=text(p.src,200),alt=text(p.alt,500);if(!/^\/media\/[a-f0-9-]{36}$/.test(src))throw new Error('Choose an uploaded photo.');if(!alt.trim())throw new Error('Add a description for every photo.');return {src,alt,caption:p.caption===undefined?'':text(p.caption,1000)};}
export function validateContent(value:unknown):SiteContent{const data=object(value),copy=object(data.copy);const cleanCopy={...defaultCopy};for(const key of Object.keys(defaultCopy) as (keyof typeof defaultCopy)[])cleanCopy[key]=text(copy[key]);
 if(!cleanCopy.name.trim())throw new Error('Your name is required.');
 const parseProject=(v:unknown)=>{const p=object(v);const title=text(p.title,300);if(!title.trim())throw new Error('Every project or course needs a title.');return {title,description:text(p.description),url:link(p.url),photo:p.photo?photo(p.photo):null};};
 const places=list(data.places,v=>{const p=object(v);if(typeof p.lat!=='number'||!Number.isFinite(p.lat)||p.lat < -85||p.lat>85||typeof p.lng!=='number'||!Number.isFinite(p.lng)||p.lng < -180||p.lng>180)throw new Error('Use latitude between -85 and 85, and longitude between -180 and 180.');const name=text(p.name,300);if(!name.trim())throw new Error('Every destination needs a name.');const id=text(p.id,80);if(!/^[a-zA-Z0-9-]+$/.test(id))throw new Error('Invalid destination ID.');return {id,name,country:text(p.country,300),description:text(p.description),lat:p.lat,lng:p.lng,photos:list(p.photos,photo,100)};});
 if(new Set(places.map(p=>p.id)).size!==places.length)throw new Error('Destination IDs must be unique.');
 return {copy:cleanCopy,portrait:data.portrait?photo(data.portrait):null,courses:list(data.courses,v=>({...parseProject(v),code:text(object(v).code,100)})),projects:list(data.projects,parseProject),places};
}
export function mediaIds(data:SiteContent){return [...new Set([data.portrait,...data.courses.map(c=>c.photo),...data.projects.map(p=>p.photo),...data.places.flatMap(p=>p.photos)].filter((p):p is Photo=>!!p).map(p=>p.src.slice('/media/'.length)))];}
