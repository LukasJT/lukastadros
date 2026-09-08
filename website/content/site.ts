export type Photo = {src:string;alt:string;caption?:string};
export type Place = {id:string;name:string;country:string;lat:number;lng:number;description:string;photos:Photo[]};
// Add only confirmed destinations. Coordinates are city-level, not personal addresses.
export const places: Place[] = [];
export const courses: {code:string;title:string;description:string;url?:string}[] = [];
export const projects: {title:string;description:string;url?:string}[] = [];
