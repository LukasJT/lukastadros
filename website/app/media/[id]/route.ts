import {bindings,database} from '../../../lib/storage';
import {isOwner} from '../../../lib/owner';
import {readContent} from '../../../lib/content';
import {mediaIds} from '../../../content/model';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Not found',{status:404});
 if(!await isOwner()&&!mediaIds((await readContent()).content).includes(id))return new Response('Not found',{status:404});
 const row=await database().prepare('SELECT content_type FROM media WHERE id = ?').bind(id).first<{content_type:string}>();if(!row)return new Response('Not found',{status:404});const object=await bindings().PHOTOS.get(id);if(!object)return new Response('Not found',{status:404});
 return new Response(object.body,{headers:{'Content-Type':row.content_type,'X-Content-Type-Options':'nosniff','Cache-Control':'private, no-cache','Content-Security-Policy':"default-src 'none'",'ETag':object.httpEtag}});
}
