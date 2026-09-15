import { env } from 'cloudflare:workers';
export type Bindings = {DB:D1Database; PHOTOS:R2Bucket; ADMIN_USER_ID?:string; OWNER_EMAIL?:string; SITE_ORIGIN?:string};
export function bindings(){return env as unknown as Bindings;}
export function database(){const db=bindings().DB;if(!db)throw new Error('Content storage is unavailable.');return db;}

