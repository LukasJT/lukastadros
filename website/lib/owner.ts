import {canWrite} from './request-policy';
import {getChatGPTUser} from '../app/chatgpt-auth';
import {bindings,database} from './storage';
// The owner email is provisioned from the Sites owner record, never from a form.
// After that verified account signs in once, its site-scoped user ID is pinned.
export async function isOwner(){
 const user=await getChatGPTUser();if(!user)return false;
 const config=bindings();if(config.ADMIN_USER_ID)return user.userId===config.ADMIN_USER_ID;
 const db=database();let owner=await db.prepare('SELECT user_id FROM owner_identity WHERE id = 1').first<{user_id:string}>();
 if(!owner&&config.OWNER_EMAIL&&user.email.trim().toLowerCase()===config.OWNER_EMAIL.trim().toLowerCase()){
  await db.prepare('INSERT OR IGNORE INTO owner_identity (id, user_id, created_at) VALUES (1, ?, ?)').bind(user.userId,new Date().toISOString()).run();
  owner=await db.prepare('SELECT user_id FROM owner_identity WHERE id = 1').first<{user_id:string}>();
 }
 return owner?.user_id===user.userId;
}
export async function authorizeWrite(request:Request){
 const user=await getChatGPTUser();
 if(!user)return Response.json({error:'Sign in to edit this site.'},{status:401});
 if(!await isOwner())return Response.json({error:'Only the site owner can edit content.'},{status:403});
 if(!canWrite(user.userId,user.userId,request.headers.get('origin'),bindings().SITE_ORIGIN))return Response.json({error:'Please save from the site editor.'},{status:403});
 return null;
}
