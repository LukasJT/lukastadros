import {database} from './storage';
import {defaultContent,type SiteContent} from '../content/model';
export async function readContent():Promise<{content:SiteContent;revision:number}>{const row=await database().prepare('SELECT document, revision FROM site_content WHERE id = 1').first<{document:string;revision:number}>();return row?{content:JSON.parse(row.document),revision:row.revision}:{content:defaultContent,revision:0};}
