import {authorizeWrite} from '../../../lib/owner';
import {getChatGPTUser} from '../../chatgpt-auth';
import {bindings,database} from '../../../lib/storage';
export async function POST(request:Request){const denied=await authorizeWrite(request);if(denied)return denied;
 const max=10*1024*1024;const declared=Number(request.headers.get('content-length'));if(declared>max)return Response.json({error:'Photos must be smaller than 10 MB.'},{status:413});
 const type=request.headers.get('content-type');if(!type||!['image/jpeg','image/png','image/webp'].includes(type))return Response.json({error:'Use a JPEG, PNG, or WebP photo.'},{status:415});
 if(!request.body)return Response.json({error:'Choose a photo first.'},{status:400});
 try{const reader=request.body.getReader();const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();return Response.json({error:'Photos must be smaller than 10 MB.'},{status:413});}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;const png=[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
 if(!(type==='image/jpeg'&&jpeg||type==='image/png'&&png||type==='image/webp'&&webp))return Response.json({error:'This file is not a supported photo.'},{status:415});
 const id=crypto.randomUUID(),bucket=bindings().PHOTOS;await bucket.put(id,bytes,{httpMetadata:{contentType:type}});
 try{await database().prepare('INSERT INTO media (id, owner_id, content_type, size, created_at) VALUES (?, ?, ?, ?, ?)').bind(id,(await getChatGPTUser())!.userId,type,size,new Date().toISOString()).run();}catch(error){await bucket.delete(id);throw error;}
 return Response.json({src:`/media/${id}`},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'The photo could not be uploaded. Please try again.'},{status:503});}
}
