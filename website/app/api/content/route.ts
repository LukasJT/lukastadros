import {limitedText} from '../../../lib/request-policy';
import {authorizeWrite} from '../../../lib/owner';
import {database} from '../../../lib/storage';
import {validateContent,mediaIds} from '../../../content/model';
export async function PUT(request:Request){const denied=await authorizeWrite(request);if(denied)return denied;
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'Expected a content form.'},{status:415});
 try{const body=await limitedText(request,1000000);if(body.length>1000000)return Response.json({error:'This update is too large.'},{status:413});const payload=JSON.parse(body);if(!Number.isInteger(payload.revision)||payload.revision<0)throw new Error('Invalid content version.');const content=validateContent(payload.content);const db=database();for(const id of mediaIds(content)){if(!await db.prepare('SELECT id FROM media WHERE id = ?').bind(id).first())throw new Error('A photo is no longer available. Please upload it again.');}
 const now=new Date().toISOString();const document=JSON.stringify(content);
 const result=payload.revision===0?await db.prepare('INSERT OR IGNORE INTO site_content (id, document, revision, updated_at) VALUES (1, ?, 1, ?)').bind(document,now).run():await db.prepare('UPDATE site_content SET document = ?, revision = revision + 1, updated_at = ? WHERE id = 1 AND revision = ?').bind(document,now,payload.revision).run();
 if(!result.meta.changes)return Response.json({error:'The site was edited in another tab. Your unsaved text is still here. Open a fresh editor to compare before saving.'},{status:409});
 return Response.json({revision:payload.revision+1},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return Response.json({error:error instanceof Error?error.message:'Could not save. Please try again.'},{status:400});}
}

